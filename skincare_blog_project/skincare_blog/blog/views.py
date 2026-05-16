from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages

from .models import Post
from .forms import PostForm


def post_list(request):
    posts = Post.objects.all()
    return render(request, 'blog/post_list.html', {'posts': posts})


@login_required
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Post published successfully.')
            return redirect('blog:post_list')
    else:
        form = PostForm()
    return render(request, 'blog/post_form.html', {'form': form, 'action': 'New'})


@login_required
def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'Post updated successfully.')
            return redirect('blog:post_list')
    else:
        form = PostForm(instance=post)
    return render(request, 'blog/post_form.html', {'form': form, 'action': 'Edit'})


@login_required
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        post.delete()
        messages.success(request, 'Post deleted successfully.')
        return redirect('blog:post_list')
    return render(request, 'blog/post_confirm_delete.html', {'post': post})


def login_view(request):
    if request.user.is_authenticated:
        return redirect('blog:post_list')
    if request.method == 'POST':
        form = AuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f'Welcome back, {user.username}!')
            return redirect('blog:post_list')
    else:
        form = AuthenticationForm()
    return render(request, 'blog/login.html', {'form': form})


def logout_view(request):
    logout(request)
    messages.info(request, 'You have been signed out.')
    return redirect('blog:post_list')
