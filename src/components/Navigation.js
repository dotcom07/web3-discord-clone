import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {

  const connectHandler = async () => {

        const accounts = await window.ethereum.request({method:'eth_requestAccounts'})
        setAccount( ethers.utils.getAddress(accounts[0]) );

  }

  return (
    <nav>
      <div className="nav__brand">
        <h1>Dappcord</h1>
      </div>

      {account ? 
      <button type="button" className='nav__connect'>
        {account.slice(0,6)+"..."+account.slice(38,42)}
      </button>
      : 
      <button type="button" className='nav__connect' onClick={connectHandler}>
        connect
      </button>}




    </nav>
  );
}

export default Navigation;