import style from './Container.module.scss'
import { FC, ReactNode } from 'react'

interface ContainerProps {
    children: ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
    return (
        <main className={style.main}>
            <div className={style.wrapper}>
                <div className={style.container}>{children}</div>
            </div>
        </main>
    )
}

export default Container
