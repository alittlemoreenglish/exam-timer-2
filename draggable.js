class DraggableContainer {
  constructor(container) {
    this.container = container;
    this.isDragging = false;
    this.isResizing = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.scale = 1;
    
    // Create resize handle
    this.resizeHandle = document.createElement('div');
    this.resizeHandle.className = 'resize-handle';
    this.container.appendChild(this.resizeHandle);

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Dragging events
    this.container.addEventListener('mousedown', (e) => this.dragStart(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.dragEnd());

    // Resizing events
    this.resizeHandle.addEventListener('mousedown', (e) => this.resizeStart(e));
    document.addEventListener('mousemove', (e) => this.resize(e));
    document.addEventListener('mouseup', () => this.resizeEnd());

    // Prevent default drag behavior
    this.container.addEventListener('dragstart', (e) => e.preventDefault());
  }

  dragStart(e) {
    // Ignore if clicking resize handle
    if (e.target === this.resizeHandle) return;

    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;

    if (e.target === this.container) {
      this.isDragging = true;
    }
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      
      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;

      this.xOffset = this.currentX;
      this.yOffset = this.currentY;

      this.setTransform();
    }
  }

  dragEnd() {
    this.isDragging = false;
  }

  resizeStart(e) {
    e.stopPropagation();
    this.isResizing = true;
    this.initialWidth = this.container.offsetWidth;
    this.initialHeight = this.container.offsetHeight;
    this.initialX = e.clientX;
    this.initialY = e.clientY;
  }

  resize(e) {
    if (this.isResizing) {
      e.preventDefault();
      
      const deltaX = e.clientX - this.initialX;
      const deltaY = e.clientY - this.initialY;
      
      const newWidth = this.initialWidth + deltaX;
      const newHeight = this.initialHeight + deltaY;
      
      // Calculate scale based on original size
      const scaleX = newWidth / this.initialWidth;
      const scaleY = newHeight / this.initialHeight;
      this.scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
      
      this.setTransform();
    }
  }

  resizeEnd() {
    this.isResizing = false;
  }

  setTransform() {
    this.container.style.transform = `translate(${this.currentX}px, ${this.currentY}px) scale(${this.scale})`;
  }
}
