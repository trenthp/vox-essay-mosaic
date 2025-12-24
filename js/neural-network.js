/* ========================================
   NEURAL NETWORK
   Interactive organic node network
   ======================================== */

const NeuralNetwork = {
  canvas: null,
  ctx: null,
  nodes: [],
  mouse: { x: null, y: null, radius: 150 },
  animationId: null,
  isActive: false,

  config: {
    nodeCount: 50,
    nodeRadius: 3,
    connectionDistance: 150,
    nodeSpeed: 0.3,
    nodeColor: 'rgba(108, 92, 231, 0.6)',
    lineColor: 'rgba(108, 92, 231, 0.15)',
    lineColorHover: 'rgba(108, 92, 231, 0.4)',
    nodeGlow: 'rgba(108, 92, 231, 0.8)',
  },

  init() {
    this.canvas = document.getElementById('networkCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createNodes();
    this.bindEvents();
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.config.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * this.config.nodeSpeed,
        vy: (Math.random() - 0.5) * this.config.nodeSpeed,
        radius: this.config.nodeRadius + Math.random() * 2,
        baseRadius: this.config.nodeRadius + Math.random() * 2,
      });
    }
  },

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createNodes();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  },

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.canvas.style.display = 'block';
    this.animate();
  },

  stop() {
    this.isActive = false;
    this.canvas.style.display = 'none';
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  animate() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateNodes();
    this.drawConnections();
    this.drawNodes();

    this.animationId = requestAnimationFrame(() => this.animate());
  },

  updateNodes() {
    for (const node of this.nodes) {
      // Move nodes
      node.x += node.vx;
      node.y += node.vy;

      // Bounce off edges
      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

      // Keep in bounds
      node.x = Math.max(0, Math.min(this.canvas.width, node.x));
      node.y = Math.max(0, Math.min(this.canvas.height, node.y));

      // Mouse interaction - expand nodes near cursor
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const scale = 1 + (1 - dist / this.mouse.radius) * 1.5;
          node.radius = node.baseRadius * scale;

          // Gentle push away from cursor
          const force = (this.mouse.radius - dist) / this.mouse.radius * 0.5;
          node.x -= (dx / dist) * force;
          node.y -= (dy / dist) * force;
        } else {
          node.radius += (node.baseRadius - node.radius) * 0.1;
        }
      } else {
        node.radius += (node.baseRadius - node.radius) * 0.1;
      }
    }
  },

  drawConnections() {
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.config.connectionDistance) {
          const opacity = 1 - dist / this.config.connectionDistance;

          // Check if near mouse for highlight
          let isNearMouse = false;
          if (this.mouse.x !== null && this.mouse.y !== null) {
            const midX = (this.nodes[i].x + this.nodes[j].x) / 2;
            const midY = (this.nodes[i].y + this.nodes[j].y) / 2;
            const mouseDist = Math.sqrt(
              Math.pow(this.mouse.x - midX, 2) + Math.pow(this.mouse.y - midY, 2)
            );
            isNearMouse = mouseDist < this.mouse.radius;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);

          if (isNearMouse) {
            this.ctx.strokeStyle = this.config.lineColorHover.replace('0.4', (opacity * 0.6).toFixed(2));
            this.ctx.lineWidth = 1.5;
          } else {
            this.ctx.strokeStyle = this.config.lineColor.replace('0.15', (opacity * 0.2).toFixed(2));
            this.ctx.lineWidth = 1;
          }

          this.ctx.stroke();
        }
      }
    }
  },

  drawNodes() {
    for (const node of this.nodes) {
      // Check if near mouse
      let isNearMouse = false;
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        isNearMouse = dist < this.mouse.radius;
      }

      // Glow effect for nodes near mouse
      if (isNearMouse) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 3
        );
        gradient.addColorStop(0, 'rgba(108, 92, 231, 0.3)');
        gradient.addColorStop(1, 'rgba(108, 92, 231, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = isNearMouse ? this.config.nodeGlow : this.config.nodeColor;
      this.ctx.fill();
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  NeuralNetwork.init();
});

// Export for theme switcher
window.NeuralNetwork = NeuralNetwork;
