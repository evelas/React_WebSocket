import React from 'react';

type ObjType = {
    id: number;
    username: string;
    event: string;
    message: string;
}

const WebSocketFC: React.FC = () => {
    const [messages, setMessages] = React.useState<Array<ObjType>>([]);
    const [value, setValue] = React.useState('');
    const socket = React.useRef<WebSocket>()
    const [connected, setConnected] = React.useState(false);
    const [username, setUsername] = React.useState('')

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5000')
        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current?.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data)
            setMessages((prev: ObjType[]) => [message, ...prev])
        }
        socket.current.onclose= () => {
            console.log('Socket closed')
        }
        socket.current.onerror = () => {
            console.error('%c%s', 'color: red; font: 1.2rem/1 Tahoma;', 'Error in socket.current.onerror')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current?.send(JSON.stringify(message));
        setValue('')
    }

    if (!connected) {
        return (
            <div className="websocket">
                <div className="websocket__form">
                    <input
                        className="websocket__input"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Name"/>
                    <button className="websocket__button" onClick={connect}>Login</button>
                </div>
            </div>
        )
    }

    return (
        <div className="websocket">
            <div>
                <div className="websocket__form">
                    <input 
                        className="websocket__input"
                        value={value} 
                        onChange={e => setValue(e.target.value)} type="text"/>
                    <button className="websocket__button" onClick={sendMessage}>Send</button>
                </div>
                <div className="websocket__messages">
                    {messages.map((obj: ObjType) =>
                        <div key={obj.id}>
                            {obj.event === 'connection'
                                ? <div className="websocket__connect">
                                    User {obj.username} online
                                </div>
                                : <div className="websocket__message">
                                    {obj.username}. {obj.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSocketFC;
