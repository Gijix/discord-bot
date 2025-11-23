import playDl from "./play-dl";

playDl.authorization()

function nor () {

}

function test(arg : boolean, arg2: boolean) {
  const condition1 = arg || arg2
  const condition2 = !(arg == true && arg2 == true)
  
  if (condition1 && condition2) {
    return true
  } 
  else {
    return false
  } 
}