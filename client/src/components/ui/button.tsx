import type {ButtonHTMLAttributes} from 'react';
import {cn} from '../../lib/utils';
export function Button({className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>){return <button className={cn('inline-flex items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-40',className)} {...props}/>}
