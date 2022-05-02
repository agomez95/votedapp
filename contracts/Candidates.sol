// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract CandidatesContract {

    //id para los Candidatos
    uint public candidatesCounter = 0;

    /**Cuando se cree este contrato se ejecutara el siguiente constructor */
    constructor () {
        addCandidate("Candidato 1", "Partido Prueba");
    }

    //con este describire que se devuelve una vez creado un candidato
    event newCandidate(
        uint id,
        string fullname,
        string agrupation,
        uint createdAt
    );

    /* Se define la estructura del candidato */
    struct Candidate {
        uint256 id;
        string fullname;
        string agrupation;
        uint256 createdAt;
    }

    /*Aqui se mapea cada candidato como un array */
    mapping (uint256 => Candidate ) public candidates;

    //agregar un candidato
    function addCandidate(string memory _fullname, string memory _agrupation) public {
        candidatesCounter++;
        candidates[candidatesCounter] = Candidate(candidatesCounter, _fullname, _agrupation, block.timestamp);
        //con esto recibo la tarea que se creo por medio del evento de arriba
        emit newCandidate(candidatesCounter, _fullname, _agrupation, block.timestamp);
    }
}