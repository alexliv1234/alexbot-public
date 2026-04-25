(function () {
  var data = window.COACH_DATA || {};

  var hm = document.getElementById('adherence-heatmap');
  if (hm && data.adherence) {
    data.adherence.forEach(function(d) {
      var cell = document.createElement('div');
      var s = d.score;
      cell.style.background = s == null ? '#eee'
        : s >= 0.8 ? '#2da44e'
        : s >= 0.6 ? '#7fbf70'
        : s >= 0.4 ? '#f0c050'
        : '#cc4040';
      cell.title = d.date + ': ' + (s == null ? '—' : s);
      hm.appendChild(cell);
    });
  }

  var wc = document.getElementById('weight-chart');
  if (wc && Array.isArray(data.weights) && data.weights.length && window.Chart) {
    new Chart(wc.getContext('2d'), {
      type: 'line',
      data: {
        labels: data.weights.map(function(w) { return w.date; }),
        datasets: [
          {
            label: 'משקל (ק"ג)',
            data: data.weights.map(function(w) { return w.weight_kg; }),
            borderColor: '#2da44e',
            tension: 0.2
          },
          {
            label: 'מותן (ס"מ)',
            data: data.weights.map(function(w) { return w.waist_cm; }),
            borderColor: '#3366cc',
            tension: 0.2
          }
        ]
      },
      options: { responsive: true, interaction: { intersect: false } }
    });
  }
})();
