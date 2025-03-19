// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 0);
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 更新活动导航项
            document.querySelectorAll('nav a').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// 表单验证和提交处理
const contactForm = document.getElementById('inquiry-form');
if (contactForm) {
    // 添加表单验证
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // 阻止默认提交行为
        let isValid = true;
        const formFields = contactForm.querySelectorAll('input[required], textarea[required]');
        
        // 移除所有现有的错误消息
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // 验证每个必填字段
        formFields.forEach(field => {
            field.classList.remove('input-error');
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('input-error');
                
                // 创建并添加错误消息
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = '此字段为必填项';
                field.parentNode.appendChild(errorMsg);
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                isValid = false;
                field.classList.add('input-error');
                
                // 创建并添加错误消息
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = '请输入有效的电子邮箱地址';
                field.parentNode.appendChild(errorMsg);
            } else if (field.type === 'tel' && !validatePhone(field.value)) {
                isValid = false;
                field.classList.add('input-error');
                
                // 创建并添加错误消息
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = '请输入有效的电话号码';
                field.parentNode.appendChild(errorMsg);
            }
        });
        
        if (!isValid) {
            return;
        } else {
            // 表单验证通过，显示提交中状态
            const submitButton = contactForm.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = '发送中...';
            submitButton.disabled = true;
            
            // 准备发送的表单数据
            const templateParams = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // 使用EmailJS发送邮件
            emailjs.send('default_service', 'template_default', templateParams)
                .then(function(response) {
                    console.log('邮件发送成功!', response.status, response.text);
                    
                    // 显示成功消息
                    contactForm.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            <h3 data-lang-key="form-success-title">提交成功!</h3>
                            <p data-lang-key="form-success-message">感谢您的询价，我们将尽快与您联系。</p>
                        </div>
                    `;
                    
                    // 更新翻译
                    if (typeof applyTranslations === 'function') {
                        applyTranslations();
                    }
                })
                .catch(function(error) {
                    console.log('邮件发送失败...', error);
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                    
                    // 显示错误消息
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = '发送失败，请稍后再试';
                    submitButton.parentNode.appendChild(errorMsg);
                });
        }
    });
    
    // 添加输入时的实时验证反馈
    contactForm.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', function() {
            // 移除错误样式和消息
            field.classList.remove('input-error');
            const errorMsg = field.parentNode.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
}

// 电子邮箱验证函数
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 电话号码验证函数
function validatePhone(phone) {
    // 简单验证：至少6位数字
    const re = /^[0-9+\-\s]{6,}$/;
    return re.test(phone);
}

// 在页面加载时设置活动导航项
function setActiveNavItem() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 添加滚动动画效果
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .service-card, .fleet-item, .contact-content, .vision-box, .mission-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// 图片懒加载功能
function lazyLoadImages() {
    const images = document.querySelectorAll('img[src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // 先设置初始状态
                img.style.opacity = '0';
                img.style.transform = 'scale(0.95)';
                img.style.transition = 'all 0.5s ease';
                
                // 确保图片源存在
                const src = img.getAttribute('data-src') || img.getAttribute('src');
                if (src) {
                    img.src = src;
                }
                
                // 添加加载中的占位动画
                img.parentElement.classList.add('loading');
                
                // 图片加载完成后显示
                img.addEventListener('load', () => {
                    setTimeout(() => {
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                        img.parentElement.classList.remove('loading');
                    }, 100);
                });
                
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// 页面加载完成后初始化
window.addEventListener('load', function() {
    setActiveNavItem();
    addScrollAnimations();
    lazyLoadImages();
});

// 添加滚动进度条
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    
    const progressWidth = `${(scrolled / scrollable) * 100}%`;
    scrollProgress.style.width = progressWidth;
});

// 页面加载完成后初始化表单验证
document.addEventListener('DOMContentLoaded', function() {
    // 表单验证已在上方实现，这里不需要重复代码
});

//Email send功能
function sendEmail() {
    // 显示发送中状态
    const submitButton = document.querySelector('.contact-form .btn');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = '发送中...';
    submitButton.disabled = true;

    // 获取表单数据
    let parms = {
        name: document.getElementById("name").value,
        company: document.getElementById("company").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value,
        // 添加收件人邮箱（如果您的模板支持）
        to_email: "yuensoonkulai@yahoo.com",
        // 添加时间戳
        timestamp: new Date().toISOString()
    };

    console.log("准备发送邮件，参数:", parms);

    // 检查EmailJS是否正确初始化
    if (typeof emailjs === 'undefined') {
        console.error("EmailJS未正确加载");
        alert("发送系统未正确加载，请刷新页面后重试");
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        return;
    }

    // 这里使用您的实际服务ID和模板ID
    emailjs.send("service_u9kqciw", "template_5a1s9bl", parms)
        .then(function(response) {
            console.log("邮件发送成功!", response);
            // 显示成功消息
            document.getElementById('inquiry-form').innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3 data-lang-key="form-success-title">提交成功!</h3>
                    <p data-lang-key="form-success-message">感谢您的询价，我们将尽快与您联系。</p>
                </div>
            `;
            // 更新翻译
            if (typeof applyTranslations === 'function') {
                applyTranslations();
            }
        })
        .catch(function(error) {
            console.error("邮件发送失败详细信息:", error);
            // 恢复按钮状态
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // 显示更详细的错误消息
            let errorMessage = "发送失败: ";
            if (error.text) {
                errorMessage += error.text;
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += "未知错误，请检查控制台";
            }
            
            alert(errorMessage);
            
            // 在控制台输出更多调试信息
            console.log("表单数据:", parms);
            console.log("EmailJS配置:", {
                serviceID: "service_u9kqciw",
                templateID: "template_5a1s9bl"
            });
        });
}