export default class CanvasImg {
    constructor (options) {
        const DEFAULT_OPTIONS = {
            canvas: null,
            imgSrc: '',
            lineStyle: {
                lineWidth: 1,
                strokeColor: '#ff0000'
            }
        }

        this._options = Object.assign({}, DEFAULT_OPTIONS ,options)

        this.rafId = null
        this.locked = true
        this._intersectPointer = null // [x, y]
        this.destoryFns = []

        // 初始化事件
        this.events = {}
        Object.keys(this._options.on).forEach(eventKey => {
            this.on(eventKey, this._options.on[eventKey])
        })
        
        
        // Canvas 信息
        this.canvas = this._options.canvas || document.createElement('canvas')
        this.canvasWidth = this.canvas.width
        this.canvasHeight = this.canvas.height
        this.ctx = this.canvas.getContext('2d')

        // 线的样式信息
        this.lineStyle = this._options.lineStyle

        // 图片信息
        this.imgSrc = this._options.imgSrc
        this.img = null
        this.imgWidth = 0
        this.imgHeight = 0
        this.utils.loadImage(this.imgSrc)
            .then((e) => {
                const target = e.target
                this.img = target
                this.imgWidth = target.width
                this.imgHeight= target.height
                this.draw()
            })

        // 绑定事件
        this._bindEvents()
    }

    get intersectPointer () {
        return this._intersectPointer
    }
    set intersectPointer (val) {
        this._intersectPointer = val

        if (val) {
            if (this.locked) {
                this.locked = false
                this.draw()
            }
        } else {
            this.locked = true
        }

    }
    draw () {
        console.log('draw')
        const { ctx } = this
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        // 绘制图片
        ctx.drawImage(this.img, 0, 0, this.imgWidth, this.imgHeight, 0, 0, this.canvasWidth, this.canvasHeight)


        if (this.intersectPointer) {
            const offsetX = this.intersectPointer[0] * this.canvasWidth
            const offsetY = this.intersectPointer[1] * this.canvasHeight
            ctx.save()
            // 线的样式
            ctx.lineWidth = this.lineStyle.lineWidth
            ctx.strokeStyle = this.lineStyle.strokeColor

            // 绘制横线
            ctx.beginPath()
            ctx.moveTo(0, offsetY)
            ctx.lineTo(this.canvasWidth, offsetY)
            ctx.stroke()
            
            // 绘制竖线
            ctx.beginPath()
            ctx.moveTo(offsetX, 0)
            ctx.lineTo(offsetX, this.canvasHeight)
            ctx.stroke()
            ctx.restore()
        }

        if (!this.locked) {
            this.rafId = requestAnimationFrame(this.draw.bind(this))
        }
    }
    utils = {
        loadImage (imgSrc) {
            return new Promise((resolve, reject) => {
                const image = new Image()
                image.onload = (e) => {
                    resolve(e)
                }
                image.onerror = (err) => {
                    reject(err)
                }
                image.src = imgSrc
            })
        },
        addEvent(el, type, handler, capture = false) {
            el.addEventListener(type, handler, handler, capture)
            return () => {
                el.removeEventListener(type, handler, handler, capture)
            }
        },
        removeEvent(el, type, handler, capture = false) {
            el.removeEventListener(type, handler, capture)
        }
    }

    _bindEvents() {
        const onMouseover = (e) => {
            this.emit('mouseover', e)
            this.draw()
        }

        const onMousemove = (e) => {
            const { offsetX, offsetY } = e
            const x = +(offsetX / this.canvasWidth).toFixed(4)
            const y = +((offsetY - 2) / this.canvasHeight).toFixed(4)
            this.intersectPointer = [x, y]

            this._triggerChange()
            this.emit('mousemove', e)
        }
        const onMouseout = (e) => {
            this.intersectPointer = null
            this._triggerChange()
            this.emit('mouseout', e)
        }

        this.destoryFns.push(this.utils.addEvent(this.canvas, 'mouseover', onMouseover))
        this.destoryFns.push(this.utils.addEvent(this.canvas, 'mousemove', onMousemove))
        this.destoryFns.push(this.utils.addEvent(this.canvas, 'mouseout', onMouseout))
    }
    _triggerChange() {
        this.emit('change', {intersectPointer: this.intersectPointer})
    }
    on (type, handler) {
        if (!this.events[type]) {
            this.events[type] = []
        }
        this.events[type].push(handler)
    }
    emit(type, args) {
        if (!this.events[type]) {
            return
        }
        this.events[type].forEach(fn => fn(args))
    }
    off(type, handler) {
        if (!this.events[type]) {
            return
        }

        this.events[type] = this.events[type].filter(fn => fn !== handler)
    }
    destory () {
        cancelAnimationFrame(this.rafId)
        this.destoryFns.forEach(fn => fn())
    }
}

