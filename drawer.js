class Drawer extends HTMLElement {
    constructor() {
        super()
        //definir shadowDOM
        this.shadow = this.attachShadow({ mode: "open" })
        //pegar botoes 
        this.buttons = document.querySelectorAll(this.getAttribute('opener'))
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        //iniciar shadowDOM
        this.connectedCallback()
    }
    connectedCallback() {
        //valores padrões para alterar estilo
        let isOpen = false
        let shadowOpt = false
        let fixed = "none"
        //se o atributo shadow for passado a opção será alterada
        if (this.hasAttribute('shadow')) {
            shadowOpt = this.getAttribute('shadow')
        }
        //se o atributo shadow for passado a opção será alterada
        if (this.hasAttribute('fixed')) {
            fixed = this.getAttribute('fixed')
        }
        //se o atributo shadow for passado a opção será alterada
        //se não o drawer será fixado
        if (this.hasAttribute('opener')) {
            this.buttons.forEach(btn => btn.addEventListener('click', () => {
                if (fixed != "true") {
                    this.manageDrawer(isOpen, shadowOpt)
                    isOpen = !isOpen
                }
            }))
        } else {
            fixed = "true"
        }
        //define style do shadowDOM
        //se o atributo shadow for verdadeiro será adicionada uma sombra ao drawer
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
        //pega o ultimo elemento, 'shadow', e adiciona evento fechar sombra
        this.shadow.querySelector('.shadow').onclick = () => {
            isOpen = false
            this.closeShadow()
        }
    }
    //função que gerencia as funções do drawer
    manageDrawer(bool, shadowOpt) {
        //abre shadow
        if (!bool) {
            this.buttons.forEach(btn => btn.classList.add('open'))
            this.shadow.querySelector('.drawer').style.left = 0
            //abre a sombra se ela for definida
            if (shadowOpt) {
                this.openShadow()
            }

        } else {
            //fecha o drawer e a sombra se estiver definida
            this.buttons.forEach(btn => btn.classList.remove('open'))
            this.shadow.querySelector('.drawer').style.left = "-300px"

            if (shadowOpt) {
                this.closeShadow()
            }
        }
    }
    //função abrir sombra, defini o display primeiro e depois a opacidade
    openShadow() {
        setTimeout(() => {
            this.shadow.lastElementChild.style.opacity = 0.5
        }, 100)
        this.shadow.lastElementChild.style.display = 'block'
    }
    //fechar sombra, define a opcaidade para 0, fecha o drawer junto à sombra e esconde a sombra
    closeShadow() {
        this.shadow.lastElementChild.style.opacity = 0
        this.shadow.querySelector('.drawer').style.left = '-300px'
        this.buttons.forEach(btn => btn.classList.remove('open'))
        this.shadow.lastElementChild.style.display = 'none'
    }
    //observa atributos
    static get observedAttributes() {
        return ['shadow', 'opener', 'fixed']
    }
}
//inicializa o componente
customElements.define('drawer-component', Drawer)