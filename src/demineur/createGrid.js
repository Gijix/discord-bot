/**
 * @typedef cas
 * @property {boolean} mine
 * @property {boolean} hidden
 * @property {boolean} flagged
 */
function getCoor(size) {
  return Math.floor(Math.random() * size);
}
const getAdjacent = (x, y, grid,size) => {
  const SIZE = size - 1;
  let result = [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y },
    { x: x + 1, y: y },
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
  ];
  result = result.filter(
    (coor) => coor.x >= 0 && coor.x <= SIZE && coor.y >= 0 && coor.y <= SIZE
  );
  let count = 0;
  result.forEach((adj) => {
    if (grid[adj.x][adj.y].mine) {
      count++;
    }
  });

  return { adj: result, BombCount: count };
};
// /**
//  * 
//  * @param {number} size 
//  * @param {number} bomb 
//  * @returns {cas[][]}
//  */
export default function createGrid(size,bomb) {
  // /**
  //  * @type {cas[][]}
  //  */
  let grid = Array.from(Array(size), () =>
    [...new Array(size)].map((x) => (x = { mine: false, hidden: true,flagged:false }))
  );
  for (let i = 0; i < bomb; i++) {
    let x = getCoor(size);
    let y = getCoor(size);
    while (grid[x][y].mine === true) {
      x = getCoor(size);
      y = getCoor(size);
    }
    grid[x][y].mine = true;
  }

 grid = grid.map((col, j, tab) =>
    col.map(
      (cas, i) =>
        (cas = {
          ...cas,
          adj: getAdjacent(j, i, tab,size).adj,
          BombCount: getAdjacent(j, i, tab,size).BombCount,
        })
    )
  );
  return grid;
}
