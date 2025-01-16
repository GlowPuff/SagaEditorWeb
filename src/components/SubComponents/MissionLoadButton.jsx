//mui
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
//icons
import FileOpenIcon from "@mui/icons-material/FileOpen";

const MissionLoadButton = () => {
  function onLoad() {

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = (event) => {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const content = e.target.result;
					const json = JSON.parse(content);
					console.log( json); // Handle the file content here

				};
				reader.readAsText(file);
			}
		};
		document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
	}

  return (
    <Tooltip title="Import a Mission">
      <Button
        sx={{ marginLeft: "auto" }}
        variant="contained"
        onClick={onLoad}
        startIcon={<FileOpenIcon />}
      >
        Import...
      </Button>
    </Tooltip>
  );
};

export default MissionLoadButton;
