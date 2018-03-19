{
	if ($0 !~ / FAILED$/) {
		print $0
		next
	}

	match($0, /(PhantomJS [0-9.]+ \([^)]+\) )?(.+) FAILED/, messageParts)
	delete errors
	errors[0] = messageParts[2]
	while (getline > 0 && $0 ~ /^[ \t]*Expected /) {
		match($0, /Expected .+\./, errorParts)
		errors[length(errors)] = errorParts[0]
	}
	match($0, /^[ \t]*(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- /, locationParts)
	print "TEST CASE FAILED: " locationParts[2]
	for (i = 0; i < length(errors); i++) {
		print errors[i]
	}
	print "END"
}
