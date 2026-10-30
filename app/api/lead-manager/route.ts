import {NextResponse} from 'next/server';
import {isAdmin} from '../../../lib/lead-manager-auth';
import {db,LEAD_STATUSES,sameOrigin} from '../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function PATCH(req:Request){
 if(!await isAdmin())return NextResponse.json({error:'UNAUTHORIZED'},{status:401});
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
 if(Number(req.headers.get('content-length')||0)>2048)return NextResponse.json({error:'INVALID'},{status:413});
 try{
  const b=await req.json() as Record<string,unknown>;
  const id=typeof b.id==='string'?b.id:'';
  const status=typeof b.status==='string'?b.status:'';
  const notes=typeof b.notes==='string'?b.notes.trim():'';
  if(!/^[0-9a-f-]{36}$/i.test(id)||!LEAD_STATUSES.includes(status as typeof LEAD_STATUSES[number])
    ||notes.length>1000)return NextResponse.json({error:'INVALID'},{status:400});
  const q=await db().query('UPDATE jmc_test_drive_leads SET status=$1,notes=$2,updated_at=now() WHERE id=$3 RETURNING id',[status,notes,id]);
  return NextResponse.json({updated:q.rowCount===1},{status:q.rowCount===1?200:404,headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'UNAVAILABLE'},{status:503})}
}
