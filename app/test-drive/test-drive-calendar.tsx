'use client';
import {useEffect,useRef,useState} from 'react';
import {JmcIcon} from '../jmc-icons';

const georgianMonths=['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'];
const weekdays=['ორშ','სამ','ოთხ','ხუთ','პარ','შაბ','კვ'];
const parse=(value:string)=>{const [y,m,d]=value.split('-').map(Number);return new Date(Date.UTC(y,m-1,d||1))};
const iso=(date:Date)=>date.toISOString().slice(0,10);
const moveMonth=(date:Date,offset:number)=>new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+offset,1));

export function TestDriveCalendar({value,onChange,min,max}:{value:string;onChange:(value:string)=>void;min:string;max:string}){
 const [open,setOpen]=useState(false);
 const [month,setMonth]=useState(()=>parse(value||min));
 const root=useRef<HTMLDivElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 const dayRefs=useRef<Record<string,HTMLButtonElement|null>>({});
 const [focusDay,setFocusDay]=useState(value||min);
 useEffect(()=>{
  if(!open)return;
  const closeOnOutside=(event:PointerEvent)=>{if(root.current&&!root.current.contains(event.target as Node))setOpen(false)};
  const closeOnEscape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();setOpen(false);trigger.current?.focus()}};
  document.addEventListener('pointerdown',closeOnOutside);
  document.addEventListener('keydown',closeOnEscape);
  return()=>{document.removeEventListener('pointerdown',closeOnOutside);document.removeEventListener('keydown',closeOnEscape)};
 },[open]);
 const first=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth(),1));
 const days=new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth()+1,0)).getUTCDate();
 const offset=(first.getUTCDay()+6)%7;
 const cells=Array.from({length:Math.ceil((offset+days)/7)*7},(_,i)=>i-offset+1);
 const minMonth=moveMonth(parse(min),0),maxMonth=moveMonth(parse(max),0);
 const canPrevious=first>minMonth,canNext=first<maxMonth;
 function select(day:string){onChange(day);setFocusDay(day);setOpen(false);trigger.current?.focus()}
 function focusDate(day:string){const limited=day<min?min:day>max?max:day;setFocusDay(limited);setMonth(moveMonth(parse(limited),0));requestAnimationFrame(()=>dayRefs.current[limited]?.focus())}
 function handleKey(event:React.KeyboardEvent<HTMLButtonElement>,day:string){
  const actions:Record<string,number>={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
  if(event.key in actions){event.preventDefault();const target=parse(day);target.setUTCDate(target.getUTCDate()+actions[event.key]);focusDate(iso(target))}
  if(event.key==='Home'||event.key==='End'){event.preventDefault();const d=parse(day);const weekday=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()+(event.key==='Home'?-weekday:6-weekday));focusDate(iso(d))}
 }
 return <div className="jmc-calendar" ref={root}>
  <button ref={trigger} type="button" className="jmc-calendar-trigger" aria-expanded={open} aria-haspopup="dialog" aria-controls="jmc-calendar-popover" onClick={()=>{
   if(!open){const current=value||min;setMonth(moveMonth(parse(current),0));setFocusDay(current)}
   setOpen(v=>!v);
  }}>
   <JmcIcon name="calendar-days" size={20}/>
   <span>{value?new Intl.DateTimeFormat('ka-GE',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(parse(value)):'აირჩიე სასურველი დღე'}</span>
   <JmcIcon name="chevron-down" size={18}/>
  </button>
  {open&&<div id="jmc-calendar-popover" className="jmc-calendar-popover" role="dialog" aria-label="სასურველი დღის არჩევა">
   <div className="jmc-calendar-top">
    <strong>{georgianMonths[month.getUTCMonth()]} {month.getUTCFullYear()}</strong>
    <div className="jmc-calendar-nav">
     <button type="button" aria-label="წინა თვე" disabled={!canPrevious} onClick={()=>setMonth(m=>moveMonth(m,-1))}><JmcIcon name="chevron-left"/></button>
     <button type="button" aria-label="შემდეგი თვე" disabled={!canNext} onClick={()=>setMonth(m=>moveMonth(m,1))}><JmcIcon name="chevron-right"/></button>
    </div>
   </div>
   <div className="jmc-calendar-grid" role="grid" aria-label="კალენდარი">
    {weekdays.map(d=><span className="jmc-calendar-weekday" key={d} aria-hidden="true">{d}</span>)}
    {cells.map((d,i)=>{
     if(d<1||d>days)return <span key={'empty-'+i} aria-hidden="true"/>;
     const day=iso(new Date(Date.UTC(month.getUTCFullYear(),month.getUTCMonth(),d)));
     const disabled=day<min||day>max;
     return <button ref={node=>{dayRefs.current[day]=node}} key={day} type="button" role="gridcell"
      aria-label={new Intl.DateTimeFormat('ka-GE',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(parse(day))}
      aria-selected={value===day} disabled={disabled} tabIndex={day===focusDay?0:-1}
      className={(value===day?'is-selected ':'')+(day===min?'is-today':'')}
      onKeyDown={event=>handleKey(event,day)} onClick={()=>select(day)}>{d}</button>;
    })}
   </div>
   <div className="jmc-calendar-footer">
    <button type="button" onClick={()=>select(min)}>დღეს</button>
    <button type="button" onClick={()=>{onChange('');setOpen(false);trigger.current?.focus()}}>გასუფთავება</button>
   </div>
  </div>}
 </div>;
}
