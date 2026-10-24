<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>{{ name }}</title>
	</head>
	<body>

		<input style="display: none" id="projectKey" value="{{ projectKey }}" />
		<input style="display: none" id="options" value="{{ options }}" />
		<input style="display: none" id="env" value="{{ env }}" />

		<div id="root"></div>
	</body>

	<script>
		window.env = document.getElementById("env").value
		window.projectKey = document.getElementById("projectKey").value
		window.options = JSON.parse(document.getElementById("options").value)
	</script>
</html>
