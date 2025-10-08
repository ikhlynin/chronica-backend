export const lineItemFormHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Create Line Item</title>
</head>
<body>
  <div id="line-item-form-container"></div>

  <script type="module">
    document.addEventListener('DOMContentLoaded', () => {
      const container = document.getElementById('line-item-form-container');
      const shadow = container.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = \`
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background: #fafafa;
          font-family: sans-serif;
        }

        .form-field {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          margin-bottom: 4px;
        }

        input, select, button {
          padding: 8px;
          font-size: 14px;
        }

        button {
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        button:hover {
          background-color: #0056b3;
        }
      \`;

      const form = document.createElement('form');
      form.enctype = 'multipart/form-data';
      form.innerHTML = \`
        <div class="form-field"><label>Size</label><input name="size" type="text" placeholder="300x250" required /></div>
        <div class="form-field"><label>Min CPM</label><input name="minCpm" type="number" step="0.01" required /></div>
        <div class="form-field"><label>Max CPM</label><input name="maxCpm" type="number" step="0.01" required /></div>
        <div class="form-field"><label>Geo</label><input name="geo" type="text" placeholder="US" required /></div>
        <div class="form-field"><label>Ad Type</label>
          <select name="adType" required>
            <option value="">Select Ad Type</option>
            <option value="banner">Banner</option>
          </select>
        </div>
        <div class="form-field"><label>Frequency Cap</label><input name="frequencyCap" type="number" min="1" required /></div>
        <div class="form-field"><label>Creative</label><input name="creative" type="file" accept="image/*,video/*" required /></div>
        <button type="submit">Create Line Item</button>
      \`;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const res = await fetch('/lineItem/createItem', {
            method: 'POST',
            body: formData
          });
          const json = await res.json();
          alert('Line Item created:\\n' + JSON.stringify(json, null, 2));
          form.reset();
        } catch (err) {
          console.error(err);
          alert('Error submitting form');
        }
      });

      shadow.appendChild(style);
      shadow.appendChild(form);
    });
  </script>
</body>
</html>
`;
