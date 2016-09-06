class Scene
	constructor: (@container, @options)->
		@renderer = PIXI.autoDetectRenderer @options.width, @options.height
		@stage = new PIXI.Container()

		@scaleStep = 0.05

		@container.appendChild @renderer.view
		@renderer.backgroundColor = @options.color

		PIXI.loader.add('images/cat.png').load @render

	render: =>
		# comment
		@thing = new PIXI.Sprite PIXI.loader.resources['images/cat.png'].texture

		@thing.position.set 320, 240
		@thing.anchor.set 0.5, 0.5

		@stage.addChild @thing
		@renderer.render @stage
		@animate()

	add: (el)=>


	animate: =>
		requestAnimationFrame @animate
		@thing.rotation += 0.1
		
		@thing.scale.x += @scaleStep
		@thing.scale.y += @scaleStep

		if @thing.scale.x > 2 || @thing.scale.x < -2
			@scaleStep *= -1

		@renderer.render @stage		

class Unit
	constructor: (@options) ->
		@object = PIXI.Sprite PIXI.loader.resources[@options.texture].texture
		@object.anchor.set 0.5, 0.5

	render: ->

scene = new Scene document.getElementById('scene'),
	width: 640
	height: 480
	color: 0xEEEEEE
