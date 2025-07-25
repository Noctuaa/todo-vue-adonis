<script setup>

</script>

<template>
	<form action="" class="w-100">
		<div class="form-group">
			<input type="email" name="email" id="email" class="form-input" placeholder="Email" required>
		</div>
		<div class="form-group">
			<input type="password" class="form-input" placeholder="Mot de passe" required>
		</div>
		<div class="error-message">

		</div>
		<button type="submit" class="btn auth-button w-100">
			<span>Se connecter</span>
		</button>
	</form>
</template>

<style>
	.form-group {
		margin-bottom: var(--spacing-5);
	}

	.form-input {
		width: 100%;
		padding: var(--spacing-3) var(--spacing-4);
		border: 2px solid var(--border-color);
		border-radius: var(--radius-lg);
		background: var(--bg-input);
		transition: all var(--duration-fast) ease;
	}

	.form-input::placeholder{
		font-size: .95rem;
		font-weight: 500;
	}

	.form-input:focus {
		outline:none;
		border-color: var(--primary);
	}

	.auth-button {
		padding: var(--spacing-3);
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: var(--text-secondary);
		border: none;
		border-radius: var(--radius-lg);
		position: relative;
		transition: all var(--duration-fast) ease;
	}

	.auth-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, .3);
	}

	.auth-button:disabled {
		opacity: .7;
		cursor: not-allowed;
		transform: none;
	}

	.auth-button span {
		font-size: 1rem;
		font-weight: 600;
	}
</style>