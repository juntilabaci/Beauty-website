from django.contrib import admin
from .models import (
    Brand, Category, Product, Review,
    UserProfile, Address, LoyaltyTransaction,
    Cart, CartItem, Wishlist, WishlistItem,
    Coupon, Order, OrderItem,
)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent', 'slug')
    prepopulated_fields = {'slug': ('name',)}


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('subtotal',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('subtotal',)


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'type', 'price', 'stock', 'is_active')
    list_filter = ('brand', 'category', 'type', 'is_active')
    search_fields = ('name', 'desc')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock', 'is_active')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating',)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'loyalty_points')


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'street', 'city', 'country', 'is_default')
    list_filter = ('country', 'is_default')


@admin.register(LoyaltyTransaction)
class LoyaltyTransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'points', 'note', 'created_at')
    list_filter = ('type',)


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'value', 'min_order', 'expires_at', 'is_active')
    list_editable = ('is_active',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'total', 'updated_at')
    inlines = [CartItemInline]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    inlines = [WishlistItemInline]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')
    list_editable = ('status',)
    inlines = [OrderItemInline]
