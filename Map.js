var TileType = {
	Empty: 0,
	Indestructable: 2,
	SpawnPoint: 3,
	Destructable: 4
};

var PowerUpType = {
	None: 0,
	Blast: 1,
	Capacity: 2,
	Speed: 3,
	Protection: 4
};

function Map(){
	// load default map template
	var map = JSON.parse(JSON.stringify(require('./defaultmap.json')));

	// get tiles and spawns information
	var tile_info, spawn_info, powerup_info;
	for( var l = 0; l < map.layers.length; l++ ){
		var layer = map.layers[l];

		switch(layer.name){
			case "objects":
				tile_info = layer.data
				break;
			case "spawn-points":
				spawn_info = layer.data
				break;
			case "powerups":
				powerup_info = layer.data
				break;
		}
	};

	// convert layers info into two-dimensional arrays(maps) for easier calculations
	var spawns = [];
	var tile_map = { cols: map.width,
					 rows: map.height };

	for( var col = 0; col < map.width; col++ ){
		tile_map[col] = [];

		for( var row = 0; row < map.height; row++ ){
			var i = row * map.width + col;
			tile_map[col][row] = tile_info[i];

			// insert spawn points into spawns array
			if(spawn_info[i] !=0) spawns.push({ col: col, row: row });
		}
	}

	// fill map with objects
	var context = this;
	var fillWith = function(tile_id, count){
		var available_tiles = context.getAvailableTiles( tile_map, spawns );
		count = Math.min(count, available_tiles.length);

		for(var i = 0; i < count; i++){
			var random_index = Math.floor(Math.random() * available_tiles.length);
			var random_tile = available_tiles[random_index];

			var ri = random_tile.row * map.width + random_tile.col;
			tile_info[ri] = tile_id;
			tile_map[random_tile.col][random_tile.row] = tile_id;

			// exclude tile from array of available ones
			available_tiles.splice(random_index, 1);
		}
	}

	var rand_int = Math.floor((Math.random() * 5) + 7);
	fillWith(TileType.Indestructable, rand_int);


	rand_int = Math.floor((Math.random() * 40) + 100);
	fillWith(TileType.Destructable, rand_int);

	// decide which powerups will be dropped
	for( var i = 0; i < tile_info.length; i++ ){
		if(tile_info[i] == TileType.Destructable)
			powerup_info[i] = this.randomizePowerup();
	}

	return map;
};

Map.prototype.getAvailableTiles = function( tile_map, spawn_points ){
	var available_tiles = [];

	for(var col = 0; col < tile_map.cols; col++){
		for(var row = 0; row < tile_map.rows; row++){
			// check, whether tile is empty(doesn't have any object on it)
			if(tile_map[col][row] != 0) continue;

			var is_tile_available = true;

			// check, whether tile is near spawn point
			for(var s = 0; s < spawn_points.length; s++){
				var sp = spawn_points[s];
				if( (row == sp.row && col == sp.col) || // is spawn point
				    (col + 1 < tile_map.cols && row == sp.row && col + 1 == sp.col) || // on the left
				 	(col - 1 < tile_map.cols && row == sp.row && col - 1 == sp.col) || // on the right
					(row + 1 < tile_map.rows && row + 1 == sp.row && col == sp.col) || // below
					(row - 1 < tile_map.rows && row - 1 == sp.row && col == sp.col) ) // above
				{
					is_tile_available = false;
					break;
				}
			}

			if(is_tile_available)
				available_tiles.push({ col: col, row: row});
		}
	}

	return available_tiles;
};

Map.prototype.randomizePowerup = function(){
	var powerup_randomizer = Math.floor(Math.random() * 10000);

	if(powerup_randomizer < 300){
		return PowerUpType.Protection;
	}
	else if(powerup_randomizer < 2300){
		return PowerUpType.Capacity;
	}
	else if(powerup_randomizer < 4300){
		return PowerUpType.Blast;
	}
	else if(powerup_randomizer < 5300){
		return PowerUpType.Speed;
	}

	return PowerUpType.None;
};

module.exports = Map;
