App = {
    contracts: {},
    candidates: {},
    init: async () => {
        console.log('Loaded')
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        App.render()
        await App.renderVotes()
        await App.renderCandidates()
    },

    loadEthereum: async () => {
        //aqui se carga el etherum proveniente del metamask de la pc
        if(window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } else if (windows.web3) {
            web3 = new Web3(window.web3.currentProvider)
        } else {
            console.log('No Ethereum browser is installed, please install Metamask')
        }
    },

    loadAccount: async () => {
        //para extraer la cuenta o id de la billetera la cargaremos en una variable accounts proveniente del proveerdor
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        App.account = accounts[0]//iteramos para extraer la cuenta
        //console.log(accounts)
    },

    loadContracts: async () => {
        const resVotes = await fetch("VotesContract.json")
        const resCandidates = await fetch("CandidatesContract.json")
        const votesContractJSON = await resVotes.json()
        const candidatesContractJSON = await resCandidates.json()

        /*al objeto votesContract le pasamos el contrato desplegado(json) mediante truffle*/
        App.contracts.votesContract = TruffleContract(votesContractJSON)
        App.candidates.candidatesContract = TruffleContract(candidatesContractJSON)

        /*asignamos un proveedor al contrato mediante el proveedio por la web(el de metamask) para conectarnos*/
        App.contracts.votesContract.setProvider(App.web3Provider)
        App.candidates.candidatesContract.setProvider(App.web3Provider)

        /**ahora vamos a desplegar el contrato*/
        App.votesContract = await App.contracts.votesContract.deployed()
        App.candidatesContract = await App.candidates.candidatesContract.deployed()
    },

    render: () => {
        //mandamos el account(ya iterado mas arriba) al elemento 'account'
        document.getElementById('account').innerText = App.account
    },

    renderCandidates: async() => {
        const candidateCounter = await App.candidatesContract.candidatesCounter()
        const candidateCounterNumber = candidateCounter.toNumber()
        
        let html = ''

        for (let i = 1; i <= candidateCounterNumber; i++) {
            const candidate = await App.candidatesContract.candidates(i)  
            const candidateId = candidate[0]
            const candidateFullName = candidate[1]
            const candidateAgrupation = candidate[2]
            const voteCreated = candidate[3]
            
            let candidateElement = `
                <option value="${candidateAgrupation}">${candidateFullName}</option>
            `
            html += candidateElement 
        }
        document.querySelector('#selectCandidate').innerHTML = html
    },
    
    renderVotes: async () => {
        const voteCounter = await App.votesContract.votesCounter()
        const voteCounterNumber = voteCounter.toNumber()

        let html = ''

        for (let i = 1; i <= voteCounterNumber; i++) {
            const vote = await App.votesContract.votes(i)  
            const vodeId = vote[0]
            const voteFullName = vote[1]
            const voteOption = vote[2]
            const voteDone = vote[3]
            const voteCreated = vote[4]    
            
            let voteElement = `
                <div class="card bg-dark rounded-0 mb-2">
                    <div class="card-header d-flex justify-content-between align-center">
                        <span>N° de voto: #${vodeId}</span>
                        <div class="form-check form-switch">
                            <input class="form-check-input" data-id="${vodeId}" type="checkbox" ${voteDone && "checked disabled"} 
                                onchange="App.proccessVote(this)"
                            />
                            <label>${voteDone && `VOTO PROCESADO` || `VOTO SIN PROCESAR`}</label>
                        </div>
                    </div>
                    <div class="card-body">
                        <span>Voto(Partido): ${voteOption}</span>
                        <p class="text-muted">Vote made on ${new Date(voteCreated * 1000).toLocaleString()}</p>
                    </div>
                </div>
            `
            html += voteElement 
        }
        document.querySelector('#voteList').innerHTML = html
    },

    doVote: async (fullname, option) => {
        const result = await App.votesContract.doVote(fullname, option, {
            from: App.account
        })
        //console.log(result.logs[0].args)
        window.location.reload()
    },

    addCandidate: async(fullname, agrupation) => {
        const result = await App.candidatesContract.addCandidate(fullname, agrupation, {
            from: App.account
        })
        //console.log(result.logs[0].args)
        window.location.reload()
    },

    proccessVote: async (element) => {
        const voteId = element.dataset.id

        await App.votesContract.proccessVote(voteId, {
            from: App.account
        })
        window.location.reload()
    }
}