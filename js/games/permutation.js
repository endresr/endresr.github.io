function shuffle(array) {
  let currentIndex = array.length;
  let output = [...array];

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [output[currentIndex], output[randomIndex]] = [
      output[randomIndex], output[currentIndex]];
  }
  return output
}

function generatePermutations(arr) {
  const result = [];

  function permute(currentArr, startIndex) {
    if (startIndex === currentArr.length - 1) {
      // Base case: a permutation is complete
      result.push([...currentArr]); // Push a copy to avoid reference issues
      return;
    }

    for (let i = startIndex; i < currentArr.length; i++) {
      // Swap the current element with the element at startIndex
      [currentArr[startIndex], currentArr[i]] = [currentArr[i], currentArr[startIndex]];

      // Recursively generate permutations for the rest of the array
      permute(currentArr, startIndex + 1);

      // Backtrack: swap them back to restore the original order for the next iteration
      [currentArr[startIndex], currentArr[i]] = [currentArr[i], currentArr[startIndex]];
    }
  }

  permute([...arr], 0); // Start the recursion with a copy of the original array
  return result
}

function multiplication(M,N) {
  output = [];
  for (let i=0;i<M.length;i++) {
    output[i]=N[M[i]-1];
  }
  return output
}

function randomMember(L) {
    return L[Math.floor(Math.random()*L.length)]
}

function generatePuzzle(permutations,levels,fixedlevels,n) {
  let solution = [];
  for (let i=0;i<levels;i++) {
    solution.push(randomMember(permutations));
  }
  console.log(solution);
  let target = Array.from(Array(n),(x,i)=>i+1);
  let puzzle = [];
  for (let i=0;i<levels;i++) {
    target = multiplication(solution[i],target);
    if (fixedlevels.includes(i)) {
      puzzle.push([solution[i]]);
      console.log(i);
    } else {
      let levelElmt = [solution[i]];
      while (levelElmt.length<3) {
        tempElmt = randomMember(permutations);
        if (!(levelElmt.includes(tempElmt))) {
          levelElmt.push(tempElmt);
        }
      }
      puzzle.push(shuffle(levelElmt));
    }
  }
  console.log(puzzle);
  return [puzzle,target]
}