import {test,expect} from '@playwright/test';

// Isolated disposable PostgreSQL only; never executed against JMC production.
// The dedicated GitHub workflow sets CMS_E2E_ENABLED=1 and random test passwords.
test('CMS: admin creates staff, permissions apply, revocation blocks old session',async({page,browser,baseURL})=>{
 test.skip(process.env.CMS_E2E_ENABLED!=='1','Requires disposable PostgreSQL service');
 const ownerName=process.env.CMS_BOOTSTRAP_USERNAME!;
 const ownerPassword=process.env.CMS_BOOTSTRAP_PASSWORD!;
 const salesPassword=process.env.CMS_TEST_SALES_PASSWORD!;
 const origin=baseURL||'http://127.0.0.1:3000';
 const anonymous=await browser.newContext();
 const unauth=await anonymous.request.get('/api/admin/users');
 expect(unauth.status()).toBe(403);

 await page.goto('/admin');
 await page.getByLabel('მომხმარებლის სახელი').fill(ownerName);
 await page.getByLabel('პაროლი',{exact:true}).fill(ownerPassword);
 await page.getByRole('button',{name:'შესვლა'}).click();
 await expect(page.getByRole('heading',{name:/გამარჯობა/})).toBeVisible();
 await page.getByRole('link',{name:'მომხმარებლები და უფლებები'}).click();
 await expect(page).toHaveURL(/\/admin\/users$/);
 await expect(page.getByRole('heading',{level:1,name:'მომხმარებლები და უფლებები'})).toBeVisible();

 const list=await page.request.get('/api/admin/users');
 expect(list.status()).toBe(200);
 const accounts=await list.json();
 expect(accounts.users.length).toBe(1);
 expect(accounts.users[0].username).toBe(ownerName);
 expect(accounts.users[0]).not.toHaveProperty('password_hash');

 const create=await page.request.post('/api/admin/users',{
  headers:{Origin:origin},
  data:{username:'qa-sales',displayName:'QA Sales',password:salesPassword,role:'sales'}
 });
 expect(create.status()).toBe(201);
 const {id}=await create.json();
 expect(id).toMatch(/^[a-f0-9-]{36}$/);

 const session=await browser.newContext();
 const salesPage=await session.newPage();
 await salesPage.goto('/admin');
 await salesPage.getByLabel('მომხმარებლის სახელი').fill('qa-sales');
 await salesPage.getByLabel('პაროლი',{exact:true}).fill(salesPassword);
 await salesPage.getByRole('button',{name:'შესვლა'}).click();
 await expect(salesPage.getByRole('heading',{name:/გამარჯობა/})).toBeVisible();
 expect((await session.request.get('/api/admin/users')).status()).toBe(403);
 expect((await session.request.get('/api/lead-manager/export')).status()).toBe(403);

 const self=await page.request.patch('/api/admin/users',{headers:{Origin:origin},
  data:{id:accounts.users[0].id,action:'set_active',active:false}});
 expect(self.status()).toBe(403);

 const disabled=await page.request.patch('/api/admin/users',{headers:{Origin:origin},
  data:{id,action:'set_active',active:false}});
 expect(disabled.status()).toBe(200);

 await salesPage.reload();
 await expect(salesPage.getByRole('heading',{level:1,name:'JMC Admin'})).toBeVisible();
 expect((await session.request.get('/api/lead-manager/export')).status()).toBe(401);
 await session.close();await anonymous.close();
});