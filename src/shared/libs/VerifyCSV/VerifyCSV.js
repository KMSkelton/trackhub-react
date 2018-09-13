export const verifyHeader = (data) => {
  if (data[0][0] === "URL" &&
    data[0][1] === "shortLabel" &&
    data[0][2] === "longLabel" &&
    data[0][3] === "color") {
    return true
  } else {
    return false
  }
}

export const removeEmpty = (data) => {
  let notEmpty = data.filter((entry) => {
    let count = 0;
    for (let i = 0; i < entry.length; i++) {
      if (entry[i] === "") {
        count++
      }
    }
    if (count === entry.length) return false;
    return true;
  });
  return notEmpty
}

export const trimEntry = (data) => {
  data.map((entry) => {
    for (let i = 0; i < entry.length; i++) {
      entry[i] = entry[i].trim();
    }
  });
  return data;
}

export const allFieldsComplete = (data) => {
  if (data["samples"] === false) {
    //TODO: make a modal to replace alert
    alert("All fields must be complete. A valid CSV must be included.")
    return false;
  }
  if (data["hubName"] === "" ||
      data["shortLabel"] === "" || 
      data["longLabel"] === "" || 
      data["email"] === ""
    ){
      //TODO: make a modal 
      alert("All fields must be complete.")
      return false
  } else {
    return true
  }
}