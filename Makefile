.PHONY: 5m.js
5m.js:
	grep '    ' README.md | sed -e 's/    //' > 5m.js
