const category_list = ['FoodGrains','Beverages','Dariy & Bakery','Home Care','Fruits & Vegetables','Branded Foods'];

(async () => {
    const status_resp = await fetch('http://localhost:3000/getstatus')
    const current_status = JSON.parse(await status_resp.text())
    if (current_status.status === "online"){
        document.getElementById('overlay').style.display = 'none';
  document.getElementById('store-closed').style.display = 'none';
    for (const category of category_list) {
        const new_element = document.createElement('div');
        new_element.setAttribute('class','product-section')
        new_element.setAttribute('id', category);
        new_element.innerHTML = `<div class="section-head mb-3">
                        <h3>${category}</h3>
                        <button>View All</button>
                    </div>`;

        try {
            const response = await fetch(`http://localhost:3000/products/getcategoryprod/${category}`);
            const data = await response.json();            
            const new_inn_element = document.createElement('div');
            new_inn_element.setAttribute('class', 'section-cards');

            data.forEach(ind_data => {
                const new_section_card = document.createElement('div');
                new_section_card.setAttribute('class', 'section-card');
                new_section_card.innerHTML = `
                    <a href="/products/${ind_data.product}">
                        <img src="http://localhost:3000/${ind_data.image}" width="175px" height="175px" alt="" />
                        <p class="product-name fw-600">${ind_data.product}</p>
                        <p class="product-price fw-bold text-center">Rs ${ind_data.price}</p>
                    </a>
                    <button class="add">ADD</button>`;
                new_inn_element.appendChild(new_section_card);
            });

            new_element.appendChild(new_inn_element);
            document.getElementById('catg-section').appendChild(new_element);

        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }}
    else{
        document.body.style.pointerEvents = 'none'
        document.getElementById('overlay').style.display = 'block';
  document.getElementById('store-closed').style.display = 'block';
    }
})();


document.getElementById('catg-section').addEventListener('click',async (event)=>{
    if (event.target && event.target.classList.contains('add')){
        const product_element = event.target.closest('.section-card')
        const product_name = product_element.innerText.split('\n\n')[0]
        document.getElementById('spinner').style.display = 'block'
        const response = await fetch('http://localhost:3000/add_to_cart/',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"product":product_name}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        if (data === "Product Added"){
        document.getElementById('spinner').style.display = 'none'
        const add_btn = event.target
        add_btn.style.display = 'none'
        const new_btn = document.createElement('div')
        new_btn.setAttribute('class','btn-group border border-dark rounded w-100')
        new_btn.innerHTML = '<button class="minus w-25">-</button><div class="quantity text-center w-50 p-2">1</div><button class="add-btn w-25">+</button>'
        product_element.appendChild(new_btn)
        }
        else{
            window.location.href = '/login'
        }
    }
})

document.getElementById('catg-section').addEventListener('click',async (event)=>{
    if (event.target && event.target.classList.contains('add-btn')){
        const element = event.target
        const product_element = event.target.closest('.section-card')
        const product_name = product_element.innerText.split('\n\n')[0]
        document.getElementById('spinner').style.display = 'block'
        const response = await fetch('http://localhost:3000/add_to_cart/',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"product":product_name}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        document.getElementById('spinner').style.display = 'none'
        const quantity = parseInt(element.previousSibling.innerText) + 1
        element.previousSibling.innerText = quantity
        

    }
})

document.getElementById('catg-section').addEventListener('click',async (event)=>{
    if (event.target && event.target.classList.contains('minus')){
        const element = event.target
        const product_element = event.target.closest('.section-card')
        const product_name = product_element.innerText.split('\n\n')[0]
        document.getElementById('spinner').style.display = 'block'
        const response = await fetch('http://localhost:3000/add_to_cart/dec-quantity',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"product":product_name}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        document.getElementById('spinner').style.display = 'none'
        const quantity = parseInt(element.nextSibling.innerText) - 1
        if (quantity == 0){
            const parent = element.parentElement
            const add_btn = parent.previousSibling
            parent.remove()
            add_btn.style.display = 'block'
        }
        else{
        element.nextSibling.innerText = quantity
        }

    }
})
