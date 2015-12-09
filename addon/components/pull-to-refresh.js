import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'pull-to-refresh-parent',
  classNameBindings: ['refreshing'],
  threshold: 50,
  refreshing: false,
  _startY: undefined,
  _lastY: undefined,

  touchStart(e) {
    this._start(e);
  },

  mouseDown(e) {
    this._start(e);
  },

  _start(e) {
    if (this.get('refreshing')) {
      return;
    }

    const y = e.originalEvent.targetTouches[0].pageY;
    this.set('_startY', y);
    this.set('_lastY', y);
  },


  touchMove(e) {
    this._move(e);
  },

  mouseMove(e) {
    if (typeof this.get('_startY') === undefined) {
      return;
    }

    this._move(e);
  },

  _move(e) {
    if (this.get('refreshing') || typeof this.get('_startY') === 'undefined') {
      return;
    }

    const y = e.originalEvent.targetTouches[0].pageY;
    this.set('_lastY', y);
    const dy = Math.min(
      this.get('_dy'),
      (this.get('threshold') * 2) + this.get('_startY')
    );

    this.$('.pull-to-refresh-child').attr('style', `top: ${dy}px;`);
  },

  touchEnd() {
    this._end();
  },

  mouseUp() {
    this._end();
  },

  mouseOut() {
    this._end();
  },

  _end() {
    if (typeof this.get('_startY') === 'undefined') {
      return;
    }

    const threshold = this.get('threshold');
    const refreshing = this.get('_dy') >= threshold;

    this.$('.pull-to-refresh-child').attr('style', `top: 0px;`);
    this.set('_startY', undefined);
    this.set('_lastY', undefined);
    this.set('refreshing', refreshing);

    if (refreshing) {
      this.sendAction('refresh');
    }
  },

  _dy: Ember.computed('_lastY', '_startY', function () {
    return this.get('_lastY') - this.get('_startY');
  })
});
