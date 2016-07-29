/**
 * @author marcelfalliere
 */

var SOCKET_SERVER = "192.168.1.16"

THREE.SocketGamepadControls = function ( camera ) {

	this.camera = camera;

  this.gamepad = {
    l1: false,
    r1: false,
    up: false,
    down: false,
    right: false,
    left: false,
    b1: false,
    b2: false,
    b3: false,
    b4: false,
    leftpad : { x:0, y:0 },
    rightpad : { x:0, y:0 }
  }

	this.config = {
    movementSpeed : 30000.0,
	  rollSpeed : 0.005
  }

  this.moveVector = new THREE.Vector3( 0, 0, 0 );

  var socket = io('http://'+SOCKET_SERVER+':3000'),
		  reconnect_error = 0;
  socket.on('gamepad', _.bind(function (data) {
    this.gamepad = data
    // console.log('leftpad x axis from socket : ', data.leftpad.x)
  }, this))
  socket.on('connect', function(data) { console.log('connect'); });
  socket.on('error', function(data) { console.log('error'); });
  socket.on('disconnect', function(data) { console.log('disconnect');  });
  socket.on('reconnect', function(data) { console.log('reconnect'); });
  socket.on('reconnect_attemp', function(data) { console.log('reconnect_attemp');  });
  socket.on('reconnecting', function(data) { console.log('reconnecting');  });
  socket.on('reconnect_error', function(data) { reconnect_error++; console.log('reconnect_error'); });
  socket.on('reconnect_failed', function(data) { console.log('reconnect_failed');  });

	this.update = function( delta ) {

		this.moveVector.x = this.gamepad.leftpad.x;
		this.moveVector.y = -1 * this.gamepad.rightpad.y;
		this.moveVector.z = this.gamepad.leftpad.y;

		var moveMult = delta * this.config.movementSpeed;
		var rotMult = delta * this.config.rollSpeed;

    if (this.camera) {
      this.camera.translateX( this.moveVector.x * moveMult );
      this.camera.translateY( this.moveVector.y * moveMult );
      this.camera.translateZ( this.moveVector.z * moveMult );
    }
	}

	this.dispose = function() {
    // TODO
	}

}
