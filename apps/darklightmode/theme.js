function changeTheme(theme){
  switch(theme){
    case "Dark":
      document.body.style.backgroundColor = "#333333";
      document.body.style.color = "white";
      break;
    case "Light":
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "black";
      break;
    case "Magenta":
      document.body.style.backgroundColor = "#ff00ff";
      document.body.style.color = "black";
      break;
  }
}

changeTheme('Dark')
