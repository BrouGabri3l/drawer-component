class Drawer extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: "open" })
        this.buttons = document.querySelectorAll(this.getAttribute('opener'))
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        this.connectedCallback()
    }
    connectedCallback() {
        let isOpen = false
        let shadowOpt = false
        let fixed = "none"

        if (this.hasAttribute('shadow')) {
            shadowOpt = this.getAttribute('shadow')
        }
        if (this.hasAttribute('fixed')) {
            fixed = this.getAttribute('fixed')
        }
        if (this.hasAttribute('opener')) {
            this.buttons.forEach(btn => btn.addEventListener('click', () => {
                if (fixed != "true") {
                    this.manageDrawer(isOpen, shadowOpt)
                    isOpen = !isOpen
                }
            }))
        }
        this.shadow.innerHTML = `<style>
        .drawer{
            padding:0 1em;
            display:flex;
            flex-direction: column;
            transition:0.5s;
            top:0;
           ${fixed != "true" ? "left: -300px" : "left: 0 !important"} ;
            position: fixed;
            width: 250px;
            height: 100%;
            background-color: #fff;
            z-index:1199;
            box-shadow: 0px 0px 9px 2px rgba(0,0,0,0.75);
                
        }
        .shadow{
            width:100vw;
            height:100%;
            background: rgb(0,0,0);
            position:fixed;
            display:none;
            transition:0.5s;
            opacity:0;
            top:0;
            left:0;
        }
        </style>
        
        <div class="drawer">
            <slot>
                <h1>!</h1>
            </slot>
        </div>
        ${shadowOpt ? '<div class="shadow"></div>' : ''}
        `
        this.shadow.lastElementChild.onclick = () => {
            isOpen = false
            this.closeShadow()
        }
    }
    manageDrawer(bool, shadowOpt) {
        if (!bool) {
            this.buttons.forEach(btn => btn.classList.add('open'))
            this.shadow.querySelector('.drawer').style.left = 0

            if (shadowOpt) {
                this.openShadow()
            }

        } else {

            this.buttons.forEach(btn => btn.classList.remove('open'))
            this.shadow.querySelector('.drawer').style.left = "-300px"

            if (shadowOpt) {
                this.closeShadow()
            }
        }
    }
    openShadow() {
        setTimeout(() => {
            this.shadow.lastElementChild.style.opacity = 0.5
        }, 100)
        this.shadow.lastElementChild.style.display = 'block'
    }
    closeShadow() {
        this.shadow.lastElementChild.style.opacity = 0
        this.shadow.querySelector('.drawer').style.left = '-300px'
        this.buttons.forEach(btn => btn.classList.remove('open'))
        this.shadow.lastElementChild.style.display = 'none'
    }

    static get observedAttributes() {
        return ['shadow', 'opener', 'fixed']
    }
}
customElements.define('drawer-component', Drawer)