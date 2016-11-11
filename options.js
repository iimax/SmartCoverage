// Saves options to chrome.storage.sync.
function save_options() {
  var carrier = document.getElementById('carrier').value;
  chrome.storage.sync.set({
    carrier: carrier
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    carrier: 'Your-CarrierName'
  }, function(items) {
    document.getElementById('carrier').value = items.carrier;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);