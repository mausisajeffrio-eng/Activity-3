// Client-side JavaScript for portfolio
(function() {
  // Theme Toggle
  const docEl = document.documentElement;
  const THEME_KEY = 'preferred-theme';
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') docEl.setAttribute('data-theme', 'dark');

  // Create theme toggle button
  const toggle = document.createElement('button');
  toggle.id = 'theme-toggle';
  toggle.type = 'button';
  
  function setToggleLabel() {
    toggle.textContent = docEl.getAttribute('data-theme') === 'dark' ? '☀️ Light' : '🌙 Dark';
    toggle.setAttribute('aria-label', 'Toggle color theme');
  }
  
  setToggleLabel();
  
  toggle.addEventListener('click', function() {
    const isDark = docEl.getAttribute('data-theme') === 'dark';
    if (isDark) {
      docEl.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
    } else {
      docEl.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
    }
    setToggleLabel();
  });
  
  document.body.appendChild(toggle);

  // Back to top button
  const toTop = document.createElement('button');
  toTop.id = 'backToTop';
  toTop.type = 'button';
  toTop.title = 'Back to top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '↑';
  toTop.addEventListener('click', function() { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  });
  
  document.body.appendChild(toTop);
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) { 
      toTop.classList.add('show'); 
    } else { 
      toTop.classList.remove('show'); 
    }
  });

  // Update year in footer
  (function updateYear() {
    var yearEl = document.getElementById('year');
    if (yearEl) { 
      yearEl.textContent = new Date().getFullYear(); 
    }
  })();

  // Function to show a message to the user
  function showMessage(message, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isError ? 'error' : 'success'}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
  }

  // Enable lazy loading for images
  (function enableLazyLoad() {
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
      if (!img.hasAttribute('loading')) { 
        img.setAttribute('loading', 'lazy'); 
      }
      if (!img.hasAttribute('decoding')) { 
        img.setAttribute('decoding', 'async'); 
      }
    });
  })();

  // Highlight active navigation
  (function highlightActiveNav() {
    var sectionIds = ['about', 'projects', 'skills', 'contact'];
    var sections = sectionIds
      .map(function(id) { 
        var el = document.getElementById(id); 
        return el ? el : null; 
      })
      .filter(Boolean);
    
    var links = Array.from(document.querySelectorAll('nav a'));
    if (!('IntersectionObserver' in window) || sections.length === 0) return;
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function(a) { 
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); 
          });
        }
      });
    }, { 
      rootMargin: '-40% 0px -55% 0px', 
      threshold: [0, 0.25, 0.5, 1] 
    });
    
    sections.forEach(function(sec) { 
      observer.observe(sec); 
    });
  })();

  // Projects data
  const projects = [
    {
      title: 'Project A',
      description: 'A simple landing page using only HTML and CSS.',
      longDescription: 'This project demonstrates clean HTML structure and modern CSS techniques. Built with semantic HTML5 elements and responsive design principles.',
      image: 'images/screenshot-project-a.png',
      link: 'http://localhost/BRGY_ATTENDANCE/'
    },
    {
      title: 'Project B',
      description: 'A responsive web application with JavaScript interactivity.',
      longDescription: 'This project showcases JavaScript DOM manipulation, event handling, and responsive design patterns.',
      image: 'images/screenshot-project-b.png',
      link: '#'
    },
    {
      title: 'Project C',
      description: 'A full-stack web application with user authentication.',
      longDescription: 'This project demonstrates full-stack development with frontend and backend integration, user authentication, and database operations.',
      image: 'images/screenshot-project-c.png',
      link: '#'
    }
  ];

  // Make projects interactive
  (function makeProjectsInteractive() {
    function createModal(project) {
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>${project.title}</h2>
          <img src="${project.image}" alt="${project.title}" />
          <p>${project.longDescription}</p>
          <a href="${project.link}" class="btn" target="_blank" rel="noopener">View Project</a>
        </div>
      `;
      
      modal.querySelector('.close').addEventListener('click', function() {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
      });
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          document.body.removeChild(modal);
          document.body.style.overflow = 'auto';
        }
      });
      
      return modal;
    }

    const cards = document.querySelectorAll('.card');
    cards.forEach(function(card, index) {
      if (projects[index]) {
        card.addEventListener('click', function() {
          const modal = createModal(projects[index]);
          document.body.appendChild(modal);
          document.body.style.overflow = 'hidden';
        });
      }
    });
  })();

  // Handle profile picture upload
  (function setupProfileUpload() {
    const profileUploadBtn = document.getElementById('upload-profile-btn');
    if (!profileUploadBtn) {
      console.error('Profile upload button not found');
      return;
    }
    
    const profileFileInput = document.createElement('input');
    profileFileInput.type = 'file';
    profileFileInput.accept = 'image/*';
    profileFileInput.style.display = 'none';
    
    // Add the file input to the DOM
    document.body.appendChild(profileFileInput);
    
    profileUploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      profileFileInput.click();
    });
    
    profileFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        showMessage('Please select a valid image file (JPEG, PNG, GIF)', true);
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('Image size should be less than 5MB', true);
        return;
      }
      
      const formData = new FormData();
      formData.append('profileImage', file);
      
      try {
        showMessage('Uploading profile picture...');
        
        const response = await fetch('/api/upload/profile', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Update the profile image
          const profileImg = document.querySelector('.profile-img');
          if (profileImg) {
            // Add timestamp to prevent caching
            profileImg.src = result.imageUrl + '?t=' + new Date().getTime();
            // Save to localStorage
            localStorage.setItem('profileImage', result.imageUrl);
          }
          showMessage('Profile picture updated successfully!');
        } else {
          throw new Error(result.message || 'Failed to upload profile picture');
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        showMessage(error.message || 'Failed to upload profile picture', true);
      } finally {
        // Reset the file input
        profileFileInput.value = '';
      }
    });
  })();

  // Handle project image upload
  (function setupProjectUploads() {
    const projectUploadBtns = document.querySelectorAll('.project-upload-btn');
    if (!projectUploadBtns.length) {
      console.error('No project upload buttons found');
      return;
    }
    
    projectUploadBtns.forEach((btn) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      
      // Add the file input to the DOM
      document.body.appendChild(fileInput);
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent card click event
        fileInput.click();
      });
      
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          showMessage('Please select a valid image file (JPEG, PNG, GIF)', true);
          return;
        }
        
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          showMessage('Image size should be less than 5MB', true);
          return;
        }
        
        const projectIndex = btn.getAttribute('data-project') || 0;
        const formData = new FormData();
        formData.append('projectImage', file);
        formData.append('projectIndex', projectIndex);
        
        try {
          showMessage('Uploading project image...');
          
          const response = await fetch('/api/upload/project', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Update the project image
            const projectImg = btn.closest('.card').querySelector('img');
            if (projectImg) {
              // Add timestamp to prevent caching
              projectImg.src = result.imageUrl + '?t=' + new Date().getTime();
              // Save to localStorage
              localStorage.setItem(`projectImage-${projectIndex}`, result.imageUrl);
            }
            showMessage('Project image updated successfully!');
          } else {
            throw new Error(result.message || 'Failed to upload project image');
          }
        } catch (error) {
          console.error('Error uploading project image:', error);
          showMessage(error.message || 'Failed to upload project image', true);
        } finally {
          // Reset the file input
          fileInput.value = '';
        }
      });
    });
  })();

  // Edit about section functionality
  (function setupAboutEditing() {
    const editBtn = document.getElementById('edit-about-btn');
    const p1 = document.querySelector('.about p:first-of-type');
    const p2 = document.querySelector('.about p:last-of-type');

    if (!editBtn || !p1 || !p2) return;

    function setEditing(isEditing) {
      [p1, p2].forEach(function(el) { 
        el.setAttribute('contenteditable', isEditing); 
      });
      editBtn.textContent = isEditing ? 'Save' : 'Edit';
      editBtn.setAttribute('aria-pressed', isEditing);
      if (isEditing) { p1.focus(); }
    }

    function saveContent() {
      const data = { 
        p1: p1.innerHTML, 
        p2: p2.innerHTML 
      };
      
      // Save to server
      fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        console.log('Success:', result);
        // Also save to localStorage as fallback
        localStorage.setItem('about-content', JSON.stringify(data));
      })
      .catch(error => {
        console.error('Error:', error);
        // Fallback to localStorage if server save fails
        localStorage.setItem('about-content', JSON.stringify(data));
      });
    }

    // Load saved content
    try {
      const saved = localStorage.getItem('about-content');
      if (saved) {
        const data = JSON.parse(saved);
        if (data && typeof data.p1 === 'string') p1.innerHTML = data.p1;
        if (data && typeof data.p2 === 'string') p2.innerHTML = data.p2;
      }
    } catch (e) {
      console.error('Error loading saved content:', e);
    }

    let editing = false;
    setEditing(false);

    editBtn.addEventListener('click', function() {
      editing = !editing;
      if (!editing) { saveContent(); }
      setEditing(editing);
    });

    // Save with Ctrl+S while editing
    document.addEventListener('keydown', function(e) {
      if (editing && (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        editing = false;
        saveContent();
        setEditing(false);
      }
    });
  })();

  // Function to update an image in the portfolio
  function updatePortfolioImage(imageType, imagePath) {
    if (imageType === 'profile') {
      // Update profile image
      const profileImg = document.getElementById('profile-image');
      if (profileImg) {
        profileImg.src = imagePath;
        // Save to localStorage as fallback
        localStorage.setItem('profileImage', imagePath);
      }
    } else if (imageType.startsWith('project')) {
      // Update project image using data-type attribute
      const projectImg = document.querySelector(`.project-img[data-type="${imageType}"]`);
      if (projectImg) {
        projectImg.src = imagePath;
        // Save to localStorage as fallback
        localStorage.setItem(`projectImage${imageType.replace('project', '')}`, imagePath);
      }
    }
  }

  // Load saved images on page load
  document.addEventListener('DOMContentLoaded', () => {
    // Load profile image
    const savedProfileImage = localStorage.getItem('profileImage');
    if (savedProfileImage) {
      const profileImg = document.querySelector('.profile-img') || document.getElementById('profile-image');
      if (profileImg) {
        profileImg.src = savedProfileImage + '?t=' + new Date().getTime();
      }
    }
    
    // Load project images
    document.querySelectorAll('.project-upload-btn').forEach((btn, index) => {
      const projectIndex = btn.getAttribute('data-project') || index + 1;
      const savedProjectImage = localStorage.getItem(`projectImage-${projectIndex}`) || localStorage.getItem(`projectImage${projectIndex}`);
      if (savedProjectImage) {
        const projectImg = btn.closest('.card').querySelector('img');
        if (projectImg) {
          projectImg.src = savedProjectImage + '?t=' + new Date().getTime();
        }
      }
    });
  });

  // Function to handle file uploads
  async function handleFileUpload(file, type, projectNumber = null) {
    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, JPG, PNG, GIF)');
      return false;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    if (projectNumber) {
      formData.append('projectNumber', projectNumber);
    }
    
    try {
      // Upload the file
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json().catch(e => {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid server response');
      });
      
      if (response.ok && result.success) {
        // Update the image on the page
        const imageType = projectNumber ? `project${projectNumber}` : 'profile';
        updatePortfolioImage(imageType, result.path);
        return true;
      } else {
        throw new Error(result.message || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload ${type} image. ${error.message}`);
      return false;
    }
  }

  // Handle profile image upload
  (function setupProfileUpload() {
    const uploadBtn = document.getElementById('upload-profile-btn');
    const fileInput = document.getElementById('profile-upload');
    
    if (!uploadBtn || !fileInput) return;
    
    uploadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });
    
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Save button state
      const originalHTML = uploadBtn.innerHTML;
      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<span class="spinner">⏳</span>';
      
      try {
        // Handle the upload
        const success = await handleFileUpload(file, 'profile');
        
        // Reset button state
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalHTML;
        fileInput.value = '';
        
        if (success) {
          alert('Profile picture updated successfully!');
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = originalHTML;
        alert('Failed to upload profile image. Please try again.');
      }
    });
  })();

  // Handle project image uploads
  (function setupProjectUploads() {
    const projectUploadButtons = document.querySelectorAll('.project-upload-btn');
    const projectFileInputs = document.querySelectorAll('.project-upload');
    
    projectUploadButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectNumber = btn.dataset.project;
        const fileInput = document.querySelector(`.project-upload[data-project="${projectNumber}"]`);
        if (fileInput) fileInput.click();
      });
    });
    
    projectFileInputs.forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const projectNumber = input.dataset.project;
        const uploadBtn = document.querySelector(`.project-upload-btn[data-project="${projectNumber}"]`);
        
        if (uploadBtn) {
          // Save button state
          const originalHTML = uploadBtn.innerHTML;
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = '<span class="spinner">⏳</span>';
          
          try {
            // Handle the upload
            const success = await handleFileUpload(file, 'project', projectNumber);
            
            // Reset button state
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalHTML;
            
            if (success) {
              alert(`Project ${projectNumber} image updated successfully!`);
            }
          } catch (error) {
            console.error('Error uploading project image:', error);
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalHTML;
            alert('Failed to upload image. Please try again.');
          }
        }
      });
    });
  })();
})();
