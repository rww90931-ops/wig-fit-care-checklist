(() => {
  const storageKey = 'wig-notes-checklist-v1';
  const checkboxes = Array.from(document.querySelectorAll('[data-check]'));
  const completedCount = document.getElementById('completed-count');
  const totalCount = document.getElementById('total-count');
  const progressBar = document.getElementById('progress-bar');
  const progressFill = document.getElementById('progress-fill');
  const resetButton = document.getElementById('reset-checklist');

  const readSavedState = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  };

  const savedState = readSavedState();

  const updateProgress = () => {
    const done = checkboxes.filter((box) => box.checked).length;
    const total = checkboxes.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    completedCount.textContent = String(done);
    totalCount.textContent = String(total);
    progressFill.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', String(percent));
  };

  checkboxes.forEach((box) => {
    box.checked = savedState[box.dataset.check] === true;
    box.addEventListener('change', () => {
      const nextState = Object.fromEntries(checkboxes.map((item) => [item.dataset.check, item.checked]));
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextState));
      } catch {
        // The checklist still works for this visit if local storage is unavailable.
      }
      updateProgress();
    });
  });

  resetButton.addEventListener('click', () => {
    checkboxes.forEach((box) => { box.checked = false; });
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // No stored state to remove; the visible checklist is already cleared.
    }
    updateProgress();
  });

  updateProgress();
})();
