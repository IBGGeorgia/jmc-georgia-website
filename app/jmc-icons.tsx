import type {SVGProps} from 'react';
export type IconName='arrow-up-right'|'arrow-right'|'arrow-down'|'chevron-down'|'menu'|'x'|'map-pin'|'calendar-days'|'car-front'|'check'|'plus';
export function JmcIcon({name,size=20,...props}:{name:IconName;size?:number}&SVGProps<SVGSVGElement>){
 const paths:Record<IconName,React.ReactNode>={
 'arrow-up-right':<><path d="M7 7h10v10"/><path d="M7 17 17 7"/></>,
 'arrow-right':<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
 'arrow-down':<><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>,
 'chevron-down':<path d="m6 9 6 6 6-6"/>,
 'menu':<><path d="M4 8h16"/><path d="M4 16h16"/></>,
 'x':<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
 'map-pin':<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 'calendar-days':<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/></>,
 'car-front':<><path d="m5 17-1 2v2M19 17l1 2v2M5 17h14M5 17l-1-5 2-6h12l2 6-1 5"/><path d="M4 12h16M7 15h.01M17 15h.01"/></>,
 'check':<path d="m5 12 4 4L19 6"/>,
 'plus':<path d="M12 5v14M5 12h14"/>
 };
 return <svg {...props} className={['jmc-icon',props.className].filter(Boolean).join(' ')} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}
