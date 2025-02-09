
  // Get all navigation links
  const links = document.querySelectorAll('nav a');
  
  // Loop through each link
  links.forEach(link => {
    // Compare link's href with current URL
    if (link.href === window.location.href) {
      link.classList.add('text-oranges'); // Add active color
      link.classList.remove('text-white');  // Remove default color
    } else {
      link.classList.add('text-white');     // Add default color
      link.classList.remove('text-oranges'); // Remove active color
    }
  })