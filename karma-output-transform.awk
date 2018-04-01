/(PhantomJS [0-9.]+ \([^)]+\) )?(.+) FAILED$/ {
	match($0, /(PhantomJS [0-9.]+ \([^)]+\) )?(.+) FAILED$/, messageParts)
	delete errors
	next
}

/<Jasmine>/ {
	next
}

!/^[ \t]/ {
	delete messageParts
	print $0
	next
}

length(messageParts) > 0 && /(Expected .+)\./ {
	match($0, /(Expected .+)\./, failureParts)
	errors[length(errors)] = failureParts[1]
	next
}

length(messageParts) > 0 && length(errors) > 0 && /^[ \t]*(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- / {
	match($0, /^[ \t]*(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- /, locationParts)
	print "TEST CASE FAILED: " locationParts[2]
	for (i = 0; i < length(errors); i++) {
		print errors[i] " - test name: " messageParts[2]
	}
	print "END"
	delete errors
	next
}

length(messageParts) > 0 && /^[ \t]*(.*) in (http:\/\/localhost:[0-9]+)?[^:]+ \(line [0-9]+\)/ {
	match($0, /^[ \t]*(.*) in (http:\/\/localhost:[0-9]+)?[^:]+ \(line [0-9]+\)/, errorParts)
	next
}

length(messageParts) > 0 && length(errorParts) > 0 && /^[ \t]*([^@]+@)?(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- / {
	match($0, /^[ \t]*([^@]+@)?(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- /, locationParts)
	print "TEST CASE FAILED: " locationParts[3]
	print errorParts[1] " - test name: " messageParts[2]
	print "END"
	delete errorParts
	next
}

/^[ \t]*([^@]+@)?(http:\/\/localhost:[0-9]+)?([^:]+:[0-9]+:[0-9]+) <- / {
	next
}

{
	print "DEBUG: " $0
}