function addOne(number) {
    return number + 1;
}

function getDealer(prevDealer) {
    var dealer;

    //if we have a dealer, get the next dealer
    if (prevDealer !== players.NONE) {
        dealer = (prevDealer + 1) % 4;
    }
        //otherwise just randomly grab one
    else {
        dealer = Math.floor(Math.random() * 4);
    }
    //animPlaceDealerButt(newDealer);
    return dealer;
}