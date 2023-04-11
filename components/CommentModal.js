import React from 'react'
import {useRecoilState} from 'recoil';
import { modalState } from '../atom/modalAtom';


export default function CommentModal() {
    const [open, setOpen] = useRecoilState(modalState);

  return (
    <div>
     <h1>comment modaal</h1>
     {open && <h1>the modal is open</h1>}
    </div>
  )
}
