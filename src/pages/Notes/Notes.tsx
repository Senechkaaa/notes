import React, { ChangeEvent, FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import style from './Notes.module.scss'
import { v4 as uuidv4 } from 'uuid'
import ModalListBoard from '../../components/ModalListBoard/ModalListBoard.tsx'
import { doc } from 'firebase/firestore'
import { updateDoc } from '@firebase/firestore'
import { db } from '../../providers/firebase.ts'
import { useGetBoards } from '../../hooks/getBoards.ts'

interface IBoardsItems {
    title: string
    id: string
}

interface IBoards {
    id: string
    title: string
    items: IBoardsItems[]
}

const Notes: FC = () => {
    const [title, setTitle] = useState<string>('')
    const [task, setTask] = useState<string>('')
    const [boards, setBoards] = useState<IBoards[]>([])
    const [showListBoards, setShowListBoards] = useState<boolean>(false)
    const [currentBoard, setCurrentBoard] = useState<IBoards | null>(null)
    const [currentItem, setCurrentItem] = useState<IBoardsItems | null>(null)

    const [getData, loading] = useGetBoards({ boards })
    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault()
        const target = e.target as HTMLDivElement
        if (target.className === style.item) {
            target.style.boxShadow = '0 2px 3px gray'
        }
    }

    function dragLeaveHandler(e: React.DragEvent) {
        const target = e.target as HTMLDivElement
        target.style.boxShadow = 'none'
    }

    function dragStartHandler(board: IBoards, item: IBoardsItems) {
        setCurrentBoard(board)
        setCurrentItem(item)
    }

    function dragEndHandler(e: React.DragEvent) {
        const target = e.target as HTMLDivElement
        target.style.boxShadow = 'none'
    }

    function dropCardHandler(board: IBoards) {
        const newBoards = getData?.boards!.map((b) => {
            if (b.id === board.id) {
                return { ...b, items: [...b.items, currentItem] }
            }
            if (b.id === currentBoard!.id) {
                const updatedItems = currentBoard!.items.filter(
                    (item) => item !== currentItem,
                )
                return { ...b, items: updatedItems }
            }
            return b
        })

        if (newBoards) {
            setBoards(newBoards.filter((board) => board !== null) as IBoards[])
            const sanitizedBoards = newBoards.map((board) => ({
                ...board,
                items: board.items.filter(
                    (item): item is IBoardsItems => item !== null,
                ),
            }))

            setBoards(sanitizedBoards)
        }

        console.log('new Data')
    }

    function dropHandler(
        e: React.DragEvent,
        board: IBoards,
        item: IBoardsItems,
    ) {
        e.preventDefault()
        const currentIndex = currentBoard!.items.indexOf(currentItem!)
        console.log(currentIndex)
        currentBoard!.items.splice(currentIndex, 1)
        const droptIndex = board.items.indexOf(item)
        board.items.splice(droptIndex + 1, 0, currentItem!)
        setBoards(
            boards.map((b) => {
                if (b.id === board.id) {
                    return board
                }

                if (b.id === item.id) {
                    return currentBoard!
                }
                return b
            }),
        )
    }

    const addBoard = () => {
        if (title.trim() === '') {
            return
        }
        const newBoard = { id: uuidv4(), title: title, items: [] }
        setBoards((prevBoards) => [...prevBoards, newBoard])
        setTitle('')
    }

    const handleAddTask = (board: IBoards) => {
        if (task.trim() === '') {
            return
        }
        board.items.push({ id: uuidv4(), title: task })
        setTask('')
        setShowListBoards(false)
    }

    const showList = () => {
        setShowListBoards(!showListBoards)
    }

    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleChangeTask = (e: ChangeEvent<HTMLInputElement>) => {
        setTask(e.target.value)
    }

    const updateData = async (boards: IBoards[]) => {
        try {
            const userRef = doc(db, 'users', localStorage.getItem('token')!)
            const updatedBoards = boards.map((board) => ({
                ...board,
                items: [...board.items],
            }))
            await updateDoc(userRef, { boards: updatedBoards })
        } catch (error) {
            console.error('Failed to update Firestore: ', error)
        }
    }

    useEffect(() => {
        if (boards.length !== 0) {
            updateData(boards)
        }
    }, [boards])

    return (
        <main className={style.main}>
            <div className={style.container_profile}>
                <Link className={style.profile} to="profile">
                    Profile
                </Link>
            </div>
            <div className={style.container_add}>
                <div>
                    <input
                        onChange={handleChangeTitle}
                        value={title}
                        className={style.input}
                        placeholder="Enter the name of the board"
                        maxLength={25}
                    />

                    <button onClick={addBoard} className={style.btn}>
                        Add board
                    </button>
                </div>
                <div>
                    <input
                        onChange={handleChangeTask}
                        value={task}
                        className={`${style.input} ${style.input_task}`}
                        maxLength={30}
                        placeholder="Enter your task"
                    />
                    <button onClick={showList} className={style.btn}>
                        Add task
                    </button>
                    <ModalListBoard isOpen={showListBoards}>
                        {getData?.boards !== undefined || null ? (
                            getData?.boards!.map((board) => (
                                <button
                                    key={board.id}
                                    onClick={() => handleAddTask(board)}
                                    className={`${style.list_btn} ${style.btn}`}
                                >
                                    {board.title}
                                </button>
                            ))
                        ) : (
                            <h3>No boards available</h3>
                        )}
                    </ModalListBoard>
                </div>
            </div>
            <div className={style.container_board}>
                {loading ? (
                    <div>Loading...</div>
                ) : getData?.boards === undefined || null ? (
                    <div>Досок нет</div>
                ) : (
                    getData?.boards!.map((board) => (
                        <div
                            onDragOver={dragOverHandler}
                            onDrop={() =>
                                dropCardHandler(board)
                            }
                            key={board.id}
                            className={style.board}
                        >
                            <h3 className={style.board_title}>{board.title}</h3>
                            {board.items.map((b) => (
                                <div
                                    onDragOver={dragOverHandler}
                                    onDragLeave={dragLeaveHandler}
                                    onDragStart={() =>
                                        dragStartHandler(board, b)
                                    }
                                    onDragEnd={dragEndHandler}
                                    onDrop={(
                                        e: React.DragEvent<HTMLDivElement>,
                                    ) => dropHandler(e, board, b)}
                                    draggable={true}
                                    key={b.id}
                                    className={style.item}
                                >
                                    {b.title}
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/*<div className={style.container_board}>*/}
            {/*    {boards.length !== 0 ? (*/}
            {/*        boards.map((board) => (*/}
            {/*            <div*/}
            {/*                onDragOver={dragOverHandler}*/}
            {/*                onDrop={() => dropCardHandler(board)}*/}
            {/*                key={board.id}*/}
            {/*                className={style.board}*/}
            {/*            >*/}
            {/*                <h3 className={style.board_title}>{board.title}</h3>*/}
            {/*                {board.items.map((b) => (*/}
            {/*                    <div*/}
            {/*                        onDragOver={dragOverHandler}*/}
            {/*                        onDragLeave={dragLeaveHandler}*/}
            {/*                        onDragStart={() =>*/}
            {/*                            dragStartHandler(board, b)*/}
            {/*                        }*/}
            {/*                        onDragEnd={dragEndHandler}*/}
            {/*                        onDrop={(*/}
            {/*                            e: React.DragEvent<HTMLDivElement>,*/}
            {/*                        ) => dropHandler(e, board, b)}*/}
            {/*                        draggable={true}*/}
            {/*                        key={b.id}*/}
            {/*                        className={style.item}*/}
            {/*                    >*/}
            {/*                        {b.title}*/}
            {/*                    </div>*/}
            {/*                ))}*/}
            {/*            </div>*/}
            {/*        ))*/}
            {/*    ) : (*/}
            {/*        <h3>Create a board</h3>*/}
            {/*    )}*/}
            {/*</div>*/}
        </main>
    )
}

export default Notes

// const [boards, setBoards] = useState([
//     {
//         id: 1,
//         title: 'Сделать',
//         items: [
//             {id: 1, title: 'Пойти в магазин'},
//             {id: 2, title: 'выкинуть мусор'},
//             {id: 3, title: 'выгулить собаку'},
//         ],
//     },
//     {
//         id: 2,
//         title: 'Проверить',
//         items: [
//             {id: 4, title: 'Код'},
//             {id: 5, title: 'Домашку'},
//             {id: 6, title: 'Друзей'},
//         ],
//     },
//     {
//         id: 3,
//         title: 'Сделано',
//         items: [
//             {id: 1, title: 'Пвидео'},
//             {id: 2, title: 'проект'},
//             {id: 3, title: 'подделка'},
//         ],
//     },
// ])
//
// const [currentBoard, setCurrentBoard] = useState(null)
// const [currentItem, setCurrentItem] = useState(null)
//
// function dragOverHandler(e) {
//     e.preventDefault()
//     if (e.target.className === style.item) {
//         e.target.style.boxShadow = '0 2px 3px gray'
//     }
// }
//
// function dragLeaveHandler(e) {
//     e.target.style.boxShadow = 'none'
// }
//
// function dragStartHandler(e, board, item) {
//     setCurrentBoard(board)
//     setCurrentItem(item)
// }
//
// function dragEndHandler(e) {
//     e.target.style.boxShadow = 'none'
// }
//
// function dropCardHandler(e, board) {
//     board.items.push(currentItem)
//     const currentIndex = currentBoard.items.indexOf(currentItem)
//     currentBoard.items.splice(currentIndex, 1)
//     setBoards(
//         boards.map((b) => {
//             if (b.id === board.id) {
//                 return board
//             }
//
//             if (b.id === currentBoard.id) {
//                 return currentBoard
//             }
//             return b
//         }),
//     )
// }
//
// function dropHandler(e, board, item) {
//     e.preventDefault()
//     const currentIndex = currentBoard.items.indexOf(currentItem)
//     currentBoard.items.splice(currentIndex, 1)
//     const droptIndex = board.items.indexOf(item)
//     board.items.splice(droptIndex + 1, 0, currentItem)
//     setBoards(
//         boards.map((b) => {
//             if (b.id === board.id) {
//                 return board
//             }
//
//             if (b.id === item.id) {
//                 return currentBoard
//             }
//             return b
//         }),
//     )
// }
//
//
// <div className={style.container_board}>
//     {boards.map((board) => (
//         <div
//             onDragOver={(e) => dragOverHandler(e)}
//             onDrop={(e) => dropCardHandler(e, board)}
//             className={style.board}
//         >
//             <div className={style.board_title}>{board.title}</div>
//             {board.items.map((item) => (
//                 <div
//                     onDragOver={(e) =>
//                         dragOverHandler(e, board, item)
//                     }
//                     onDragLeave={(e) => dragLeaveHandler(e)}
//                     onDragStart={(e) =>
//                         dragStartHandler(e, board, item)
//                     }
//                     onDragEnd={(e) => dragEndHandler(e)}
//                     onDrop={(e) => dropHandler(e, board, item)}
//                     draggable={true}
//                     className={style.item}
//                 >
//                     {item.title}
//                 </div>
//             ))}
//         </div>
//     ))}
// </div>

// useEffect(() => {
//     if (boards.length !== 0) {
//         const boards_data: IBoardsObjData = {
//             boards: boards.map((b) => ({
//                 ...b,
//                 items: Object.assign({}, b.items),
//             })),
//         }
//         updateData(boards_data)
//     }
// }, [handleAddTask, setBoards])
