class Animation {
    constructor(helpLine) {
        this.items = [];
        this.attrs = ['anim-name', 'anim-duration', 'anim-delay'];
        this.bottomLine = 6.5 * document.documentElement.clientHeight / 8;
        this.helpLine = helpLine;
        this.isScrolling = false;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this._initItems();
            if (this.helpLine) this._createHelpLine();
            window.onscroll = this._throttleScroll.bind(this);
        });
    }

    _throttleScroll() {
        if (!this.isScrolling) {
            window.requestAnimationFrame(() => {
                this._scrollAnimate();
                this.isScrolling = false;
            });
        }
        this.isScrolling = true;
    }

    _initItems() {
        let items = document.querySelectorAll('[anim-name]');
        for (let item of items) {
            let duration = item.getAttribute('anim-duration') || 1;
            let className = item.getAttribute('anim-name');
            let classNameOut = item.getAttribute('anim-name-out');
            let delay = item.getAttribute('anim-delay') || 0;
            let chain = item.getAttribute('anim-chain');
            this.items.push({ DOM: item, duration, className, delay, animated: false, classNameOut, chain });
            this.items.map(innerItem => { this._addAnimate({ item: innerItem, className: innerItem.className }) });
        }
    }

    _animate(item) {
        let coords = item.DOM.getBoundingClientRect();
        if (coords.bottom > this.bottomLine && item.animated) this._removeClass(item);

        if(!item.animated) {
            if (coords.top < this.bottomLine) this._addAnimate({ item, className: item.className });
            else this._addAnimate({ item, className: item.classNameOut });
        }
    }

    _removeClass(item) {
        if(+item.chain) {
            let children = item.DOM.children;
            for (let i = 0; i < children.length; i++) {
                children[i].classList.remove(item.className);
                children[i].classList.remove(item.classNameOut);
            }
        }
        else {
            item.DOM.classList.remove(item.className);
            item.DOM.classList.remove(item.classNameOut);
        } 
        
        item.animated = false;
    }

    _addAnimate({ item, className }) {
        if(item.chain) {
            let children = item.DOM.children;
            let delay = 0;
            if (+item.delay) delay = +item.delay;
            for(let i = 0; i < children.length; i++) {
                if (!children[i].classList.contains(className) && className) {
                    children[i].classList.add(className);
                } 
                children[i].style.animationDelay = `${+item.chain * i + delay}s`;
                children[i].style.animationDuration = `${+item.duration}s`;
                children[i].style.animationFillMode = 'both';
            }
            item.animated = true;
        }
        else {
            if (!item.DOM.classList.contains(className) && className) {
                item.DOM.classList.add(className);
            }
            if (+item.delay) item.DOM.style.animationDelay = `${+item.delay}s`;
            item.DOM.style.animationDuration = `${+item.duration}s`;
            item.DOM.style.animationFillMode = 'both';
            item.animated = true;
        }

    }
    
    _scrollAnimate() {
        for (let item of this.items) {
            this._animate(item);
        }
    }

    _createHelpLine() {
        let e = document.createElement('div');
        e.style.position = 'fixed';
        e.style.height = this.bottomLine + 'px';
        e.style.width = '100%';
        e.style.top = 0;
        e.style.borderBottom = 'solid 1px #000';
        document.body.appendChild(e);
    }

    get(index) {
        return index !== undefined ? this.items[index] : this.items;
    }

    set({ f, v, index }) {
        if(f && v !== undefined && typeof(index) == 'number') this.items[index][f] = v;
        else console.log('Invalid params');
    }
}
