const category_list = ['FoodGrains','Beverages','Dariy & Bakery','Home Care','Fruits & Vegetables','Branded Foods'];

(async () => {
    const status_resp = await fetch('http://localhost:3000/getstatus')
    const current_status = JSON.parse(await status_resp.text())
    if (current_status.status === 'online'){
        document.getElementById('store-status').innerText = "Store Status - Online"
        document.getElementById('update_status').checked = true
    }
    else{
        document.getElementById('store-status').innerText = "Store Status - Offline"
        document.getElementById('update_status').checked = false
    }




    for (const category of category_list) {
        const new_element = document.createElement('div');
        new_element.setAttribute('id', category);
        new_element.innerHTML = `<h3 class="text-decoration-underline">${category}</h3>`;

        try {
            const response = await fetch(`http://localhost:3000/products/getcategoryprod/${category}`);
            const data = await response.json();
            
            const new_inn_element = document.createElement('div');
            new_inn_element.setAttribute('class', 'section-cards mt-3 mb-3');

            data.forEach(ind_data => {
                const new_section_card = document.createElement('div');
                new_section_card.setAttribute('class', 'section-card');
                new_section_card.innerHTML = `
                    
                        <img src="http://localhost:3000/${ind_data.image}" width="175px" height="175px" alt="" />
                        <p class="product-name">${ind_data.product}</p>
                        <p class="product-price fw-bold text-center">Rs ${ind_data.price}</p>
                        <p class="quantity-left fw-bold text-center">Left Items: ${ind_data.quantity}</p>
                    <button class="modify">MODIFY</button>
                    <button class="delete">DELETE</button>`;
                new_inn_element.appendChild(new_section_card);
            });

            new_element.appendChild(new_inn_element);
            document.getElementById('categories').appendChild(new_element);

        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }
})();




document.getElementById('update_status').addEventListener('click',async()=>{
    if (document.getElementById('update_status').checked){
        const response = await fetch('http://localhost:3000/admin_panel/status',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"status":"online"}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        document.getElementById('store-status').innerText = "Store Status - Online"
        document.getElementById('toast-text').innerText = data
        setTimeout(() => {
        document.getElementById('updated-toast').display = 'none'
            
        }, 3000);
    }
    else {
        const response = await fetch('http://localhost:3000/admin_panel/status',{
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({"status":"offline"}),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.text()
        document.getElementById('store-status').innerText = "Store Status - Offline"
    }

})


document.getElementById('categories').addEventListener('click',async(event)=>{
    if (event.target && event.target.classList.contains('modify')){
        const product_element = event.target.closest('.section-card')
        console.log(product_element)
        console.log(product_element.innerText.split("\n\n"))     
    }
})

document.getElementById('categories').addEventListener('click',async(event)=>{
    if (event.target && event.target.classList.contains('delete')){
        const product_element = event.target.closest('.section-card')
        const product_name = (product_element.innerText.split("\n\n"))[0]
        document.getElementById('del-prod-name').innerText = `${product_name} ?`
        document.getElementById('custom-modal').style.display = 'block';


        document.getElementById('no').addEventListener('click',()=>{
            document.getElementById('custom-modal').style.display = 'none';
        })
        
        document.getElementById('yes').addEventListener('click',async()=>{
            const response = await fetch('http://localhost:3000/admin_panel/deleteproduct',{
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({"product":product_name}),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await response.text()
            document.getElementById('custom-modal').style.display = 'none';
            document.querySelector('.modal-head').innerText = "Product deleted"
            document.querySelector('.modal-text').innerText = `${data}\nPlease reload the page to see changes`
            document.querySelector('.custom-self-modal').style.display = 'block'
            setTimeout(() => {
                document.querySelector('.custom-self-modal').style.display = 'none'
            }, 2500);

        })
    }
})

