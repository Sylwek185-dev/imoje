document
	.getElementById('payment-form')
	.addEventListener('submit', function (event) {
		event.preventDefault();

		const amount = parseInt(document.getElementById('amount').value, 10);
		const firstName = document.getElementById('firstName').value.trim();
		const lastName = document.getElementById('lastName').value.trim();
		const email = document.getElementById('email').value.trim();
		const phone = document.getElementById('phone').value.trim();

		// Walidacja danych
		const containsSpecialChars =
			/[<>;{}]/.test(firstName) || /[<>;{}]/.test(lastName);
		if (containsSpecialChars) {
			alert(
				'Błędne dane: imię i nazwisko nie mogą zawierać specjalnych znaków.'
			);
			return;
		}

		if (!firstName || !lastName) {
			alert('Imię i nazwisko są wymagane.');
			return;
		}

		if (!isNaN(firstName) || !isNaN(lastName)) {
			alert('Błędne dane: imię nie może być liczbą.');
			return;
		}

		if (!email || !validateEmail(email)) {
			alert('Błędne dane: podaj poprawny adres email.');
			return;
		}

		if (!phone || !validatePhone(phone)) {
			alert('Błędne dane: podaj poprawny numer telefonu.');
			return;
		}

		if (isNaN(amount) || amount <= 0) {
			alert('Błędne dane: podaj poprawną kwotę.');
			return;
		}

		console.log('Dane są poprawne.');

		// Kontynuacja z przetwarzaniem formularza
		const apiEndpoint = 'https://imoje.vercel.app/proxy/payment';
		const headers = new Headers({
			'Content-Type': 'application/json',
		});

		const body = JSON.stringify({
			amount: amount * 100,
			currency: 'PLN',
			serviceId: 'cd1c032d-2315-49a7-84cd-57eef2fe7938',
			orderId: '12',
			customer: {
				email: email,
				firstName: firstName,
				lastName: lastName,
				phone: phone,
			},
		});

		fetch(apiEndpoint, {
			method: 'POST',
			headers: headers,
			body: body,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				console.log('Response data:', data);
				if (data.payment && data.payment.url) {
					window.location.href = data.payment.url;
				} else {
					alert('Płatność się nie powiodła.');
				}
			})
			.catch((error) => {
				console.error('Error:', error);
				alert('Wystąpił błąd. Proszę spróbować ponownie.');
			});
	});

function validateEmail(email) {
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return re.test(email);
}

function validatePhone(phone) {
	const re = /^[0-9]{7,15}$/;
	return re.test(phone);
}
