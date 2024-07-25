import { FC, ReactNode } from 'react'
import style from './ModalListBoard.module.scss'

interface ModalListBoardProps {
    isOpen: boolean
    children: ReactNode
}

const ModalListBoard: FC<ModalListBoardProps> = ({ children, isOpen }) => {
    const rootClases = [style.modal]

    if (isOpen) {
        rootClases.push(style.active)
    }

    return (
        <div className={rootClases.join(' ')}>
            <div className={style.modal_content}>{children}</div>
        </div>
    )
}

export default ModalListBoard
