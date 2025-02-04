import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Channels from './components/Channels'
import Servers from './components/Servers'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {

  const [provider, setProvider] = useState("");
  const [account, setAccount] = useState("");
  const [dappcord, setDappcord] = useState();
  const [channels, setChannels] = useState([]);

  const [currentChannel, setCurrentChannel] = useState(null);

  const [messages, setMessages] = useState([]);

  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);


    const network = await provider.getNetwork();
    const dappcord = new ethers.Contract( config[network.chainId].Dappcord.address , Dappcord , provider )
    setDappcord(dappcord);

    const totalChannels = await dappcord.totalChannels();

    let channels = [];

    for (let i = 0 ; i<totalChannels ; i++) {
      const channel = await dappcord.getChannel(i+1);
      channels.push(channel);
    }

    setChannels(channels);

    

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload();
    })

  }

  useEffect(()=>{
    loadBlockchainData();

    socket.on("connect", ()=>{
      socket.emit("get messages")
      console.log("connected")
    })
  
    socket.on("new message", (messages)=>{
      setMessages(messages);
    })
  
    socket.on("get messages", (messages)=>{
      setMessages(messages);
    })

    return () => {
      socket.off("connect")
      socket.off("new message")
      socket.off("get message")
    }
  },[])



  

  return (
    <div>
       <Navigation account={account} setAccount={setAccount}/>
      
      <main>

        <Servers/>
        <Channels provider={provider} account={account} dappcord={dappcord} channels={channels} currentChannel={currentChannel} setCurrentChannel={setCurrentChannel}/>
        <Messages account={account} messages={messages} currentChannel={currentChannel}/>

      </main>
    </div>
  );
}

export default App;
