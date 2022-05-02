/**Aca importo el contrato inteligente por medio de artifacts que es del testing mocca*/
const VotesContract = artifacts.require("VotesContract")

//aqui se testea el contrato importado
contract("VotesContract", () => {

    /**Lo primero que se hace es ejecutar el sgte codigo para obtener el contrato en una variable*/
    before(async () => {
        //con this podra ser accedido por medio de otra variables ya que esta en el scope
        this.votesContract = await VotesContract.deployed()
    })

    /**aqui comprobaremos si el contrato fue desplegado por medio de it que es para describir un testing*/
    it('migrate deployed successfully', async () => {
        const address = this.votesContract.address
        //verificamos si la direccion del contrato es real
        assert.notEqual(address, null) //si no es null
        assert.notEqual(address, undefined) //si no esta definido
        assert.notEqual(address, 0x0) //si no es un hexadecimal vacio o tiene decimal
        assert.notEqual(address, "") //si no tiene un string vacio
    })

    /**aqui comprobaremos si podemos obtener uina lista de tareas */
    it('get Votes list', async () => {
        //aqui guadaremos el contador de votos en una variable, si esta en 0 o 1
        const votesCounter = await this.votesContract.counter()
        //aqui pasamos ese contador a la lista de tareas para extraer un valor
        const vote = await this.votesContract.votes(votesCounter)

        assert.equal(vote.id.toNumber(), votesCounter)
        assert.equal(vote.fullname, "Usuario Prueba")
        assert.equal(vote.option, "Opcion Prueba")
    })

    it('vote do it successfully', async () => {
        const result = await this.votesContract.doVote("Usuario de Test", "Voto de Test")
        const voteEvent = result.logs[0].args
        const votesCounter = await this.votesContract.counter()

        assert.equal(votesCounter, 2)
        assert.equal(voteEvent.id.toNumber(), 2)
        assert.equal(voteEvent.fullname, "Usuario de Test")
        assert.equal(voteEvent.option, "Voto de Test")
        assert.equal(voteEvent.done, false)
    })

    it('vote processed successfully', async () => {
        const result = await this.votesContract.proccessVote(1)
        const voteEvent = result.logs[0].args 

        const vote = await this.votesContract.votes(1) //aqui consultamos el voto 1 de todas los votos

        assert.equal(voteEvent.id, 1)
        assert.equal(voteEvent.done, true)

        assert.equal(vote.done, true)
    })
}) 