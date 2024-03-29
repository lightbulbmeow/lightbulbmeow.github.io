let darkColor = "#333333";
let lightColor = "#ffffff";
let customColor = "#ff00ff";
let selectedTheme = "Dark";

function changeTheme(theme){
  selectedTheme = theme
  switch(theme){
    case "Dark":
      document.body.style.backgroundColor = darkColor;
      document.body.style.color = "white";
      break;
    case "Light":
      document.body.style.backgroundColor = lightColor;
      document.body.style.color = "black";
      break;
    case "Custom":
      document.body.style.backgroundColor = customColor;
      document.body.style.color = "black";
      break;
  }
}

function changeDarkColor(color){
  darkColor = color
  changeTheme(selectedTheme)
}

function changeLightColor(color){
  lightColor = color
  changeTheme(selectedTheme)
}

function changeCustomColor(color){
  customColor = color
  changeTheme(selectedTheme)
}
