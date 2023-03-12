const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';
const specials = '!@#$%^&*()_-+={}<>[]/.,?;~|';

const maxLengthOfPassword = 15;
const defaultLengthOfPassword = 6;

let isActive = new Map([['uppercase', true]])
let timer;

const input = document.querySelector('.slider-input');
const slider = document.querySelector('.slider');
const thumb = document.querySelector('.thumb');
const pass = document.querySelector('.password');
const buttons = document.querySelector('.buttons');

pass.addEventListener('click', e => {
    const copiedInfo = document.querySelector('.copied-info');
    copiedInfo.style.visibility = "visible";
    copiedInfo.style.opacity = "1";
    navigator.clipboard.writeText(pass.textContent);
    let steps = 0;

    function finishAnimation() {
        steps++;
        if (steps == 1) {
            copiedInfo.style.opacity = "";

        } else {
            copiedInfo.style.visibility = "";
            copiedInfo.removeEventListener('transitionend', finishAnimation);

        }
    }

    copiedInfo.addEventListener('transitionend', finishAnimation);
});

buttons.addEventListener('click', e => {
    if (e.target.classList[0] != e.currentTarget) {
        isActive.set(e.target.classList[0], e.target.classList.toggle('active'));
        if (buttons.querySelector('.active') == null) {
            isActive.set(e.target.classList[0], e.target.classList.toggle('active'));
        }
        else {
            genPass(input.value);
        }
    }
});

window.addEventListener('load', e => {
    input.setAttribute('min', '1');
    input.setAttribute('max', maxLengthOfPassword);
    input.value = defaultLengthOfPassword;
    genPass(defaultLengthOfPassword);
    thumb.style.left = (defaultLengthOfPassword - 1) * ((slider.offsetWidth - thumb.offsetWidth) + 2) / (maxLengthOfPassword - 1) - 2 + 'px';
})

input.addEventListener('change', e => {
    if (e.target.value > maxLengthOfPassword) {
        e.target.value = maxLengthOfPassword;
    }
    else if (e.target.value < 1) {
        e.target.value = 1;
    }
    genPass(e.target.value);
    thumb.style.left = (+e.target.value - 1) * ((slider.offsetWidth - thumb.offsetWidth) + 2) / (maxLengthOfPassword - 1) - 2 + 'px';
})

slider.addEventListener('click', e => {
    if (e.target == e.currentTarget) {
        const maxRight = slider.offsetWidth - thumb.offsetWidth;
        let shiftX = e.clientX - slider.getBoundingClientRect().left - (thumb.offsetWidth / 2);

        if (shiftX < 0) {
            shiftX = -2;
        }
        else if (shiftX > maxRight) {
            shiftX = maxRight
        }

        thumb.style.left = shiftX + 'px';
        const newInput = Math.floor((shiftX + 2) * (maxLengthOfPassword - 1) / (maxRight + 2) + 1);
        
        if (input.value != newInput) {
            genPass(newInput);
        }
        input.value = newInput;
    }
})

thumb.addEventListener('mousedown', e => {
    e.preventDefault();
    thumb.style.borderColor = 'hsl(60, 100%, 50%)';

    const startX = e.clientX - thumb.getBoundingClientRect().left;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(e) {
        let newLeft = e.clientX - startX - slider.getBoundingClientRect().left;
        const maxRight = slider.offsetWidth - thumb.offsetWidth;

        if (newLeft < 0) {
            newLeft = -2;
        }
        else if (newLeft > maxRight) {
            newLeft = maxRight;
        }
        thumb.style.left = newLeft + 'px';
        const newInput = Math.floor((newLeft + 2) * (maxLengthOfPassword - 1) / (maxRight + 2) + 1);
        
        if (input.value != newInput) {
            genPass(newInput);
        }
        input.value = newInput;
    }

    function onMouseUp(e) {
        thumb.style.borderColor = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
})

function genPass(length) {
    clearInterval(timer);

    let value = Array(length);
    let dictionary = '';

    if (isActive.get('uppercase'))
        dictionary += upperLetters;
    if (isActive.get('lowercase'))
        dictionary += lowerLetters;
    if (isActive.get('digit'))
        dictionary += digits;
    if (isActive.get('special'))
        dictionary += specials;

    for(let i = 0; i < length; i++) {
        value[i] = dictionary[Math.floor(Math.random() * dictionary.length)]
    }
    
    let iterations = 0;
    timer = setInterval(() => {
        pass.textContent = value.map((letter, index) => {
            if (index < iterations) {
                return value[index];
            }
            return dictionary[Math.floor(Math.random() * dictionary.length)];
        })
        .join('');
        if (iterations >= value.length) {
            clearInterval(timer);
        }
        iterations += 1 / 3;        
    }, 30) 
}