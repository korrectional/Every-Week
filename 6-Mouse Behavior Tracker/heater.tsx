import { useState, useEffect } from 'react'
import '../App.css'

/* 
This is a small program I made for fun, but its a nice example of how useEffect works in react.
What it does is it sends the mouse coordinates to the server every second, but only if the tab is visible.
The server will save that data in a txt file.
*/

export default function heater() {

    const [wait, setWait] = useState(0);



    var mouse;
    var visible = true;
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState != 'visible') {
            visible = false;
        }else{
            visible = true;
        }
    });
    addEventListener('mousemove', (event) => {
        mouse = {x: event.x, y: event.y}
    });
    function updateMouseData(){
        if(!visible){
            return;
        }
        fetch('http://localhost:3001/api/mouse', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ one: mouse.x, two: mouse.y }),
        }).then(response => response.json()).then(data => console.log(data));

        setWait(wait + 1);
    }
    useEffect(() => {
        const interval = setInterval((updateMouseData), 1000)
        return () => clearInterval(interval)
    },[])




    return;
}