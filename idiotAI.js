function aiPickCard_1(player){
	for(var i=0; i<hands[player].length; i++){
		if(isValidPlay(player, hands[player][i])){
			return hands[player][i];
		}
	}
	return hands[player][0];
}

function aiTakeOrderedUp_1(player){
	return hands[player][0];
}