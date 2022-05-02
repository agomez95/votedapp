// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract VotesContract {

    //contador o id para los votos
    uint public votesCounter = 0;

    /**Cuando se cree este contrato se ejecutara el siguiente constructor */
    constructor () {
        doVote("Usuario 1", "Opcion Prueba");
    }

    //con este describire que se devuelve una vez hecho un voto
    event VoteMade(
        uint id,
        string fullname,
        string option,
        bool done,
        uint createdAt
    );

    event VoteProcessed(
        uint id,
        bool done 
    );

    /* Se define la estructura del voto */
    struct Vote {
        uint256 id;
        string fullname;
        string option;
        bool done;
        uint256 createdAt;
    }

    /*Aqui se mapea cada voto como un array */
    mapping (uint256 => Vote ) public votes;

    //hacer el voto
    function doVote(string memory _fullname, string memory _option) public {
        votesCounter++;
        votes[votesCounter] = Vote(votesCounter, _fullname, _option, false, block.timestamp);
        //con esto recibo la tarea que se creo por medio del evento de arriba
        emit VoteMade(votesCounter, _fullname, _option, false, block.timestamp);
    }

    //procesar el voto
    function proccessVote(uint _id) public {
        Vote memory _vote = votes[_id];
        _vote.done = !_vote.done;
        votes[_id] = _vote;
        emit VoteProcessed(_id, _vote.done);
    }
}
