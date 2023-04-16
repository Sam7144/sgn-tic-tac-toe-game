import React, { useState } from "react"
import { Bord } from "./Bord"
import './tictac.scss'
type BoardArray=Array<Array<string|null>>
const makeComputerMove=(board:BoardArray):[number,number]=>{
    const emptyCells:[number,number][]=[];
    board.forEach((row,rowIndex)=>{
        row.forEach((cell,cellIndex) => {
            if(!cell){
                emptyCells.push([rowIndex,cellIndex])
            }
        });
    })
    const randomIndex=Math.floor(Math.random()*emptyCells.length)
    return emptyCells[randomIndex];
}
const checkWinner=(board:BoardArray):string|null=>{
    const lines=[
        [board[0][0],board[0][1] ,board[0][2]],
        [board[1][0],board[1][1] ,board[1][2]],
        [board[2][0],board[2][1] ,board[2][2]],
        [board[0][0],board[1][0] ,board[2][0]],
        [board[0][1],board[1][1] ,board[2][1]],
        [board[0][2],board[1][2] ,board[2][2]],
        [board[0][0],board[1][1] ,board[2][2]],
        [board[0][2],board[1][1] ,board[2][0]]
    ];
    for(const line of lines){
        if(line[0]&&line[0]===line[1] &&line[1]===line[2]){
            return line[0]
        }
    }
    return null
}
export const TikTacToe=()=>{
    const intialBoard=Array.from({length:3},()=>Array.from({length:3},()=>null))
    const [board,setBoard]=useState<BoardArray>(intialBoard)
    const [player,setPlayer]=useState<string>('X');
    const [winner,setWinner]=useState<string|null>(null)
    const[noWinner,setNoWinner]=useState<boolean>(false)
    const handleOnClick=(row:number,col:number)=>{
        if(board[row][col]||winner){
            return
        }
        const updatedPlayer=board.map((newRow,rowIndex)=>(
            newRow.map((cell,cellIndex)=>rowIndex===row&&cellIndex===col?player:cell)
        ))
        setBoard(updatedPlayer)
        const newWinner=checkWinner(updatedPlayer)
        setWinner(newWinner)
        setPlayer('X')
        const hasNullValue=updatedPlayer.some((row)=>row.some((cell)=>cell===null))
        if(!noWinner&&!hasNullValue){
            setNoWinner(true)
            return
        }
        if(!newWinner){
            const [computerRow,computerCol]=makeComputerMove(updatedPlayer)
            const updatedComputer=updatedPlayer.map((newRow,rowIndex)=>newRow.map((cell,cellIndex)=>
            rowIndex===computerRow&&cellIndex===computerCol?"O":cell)
            )
            setTimeout(()=>{
                setBoard(updatedComputer)
                setWinner(checkWinner(updatedComputer))

            },200)
        }
    }
    const restartGame=()=>{
        setBoard(intialBoard)
        setPlayer('X')
        setWinner(null)
        setNoWinner(false)
    }
    return(
        <>
        <div className='game'>
        <h1>tikTacToe game</h1>
        <Bord board={board} handleClick={handleOnClick}/>
        <p>{winner&& `${winner==="X"?"You Win":"AI WINS"}`}</p>
        {noWinner&&
        <p>no winner</p>
        }
        <button className='reset' onClick={()=>restartGame()}>Start New Game</button>
        </div>
        </>
    )
}